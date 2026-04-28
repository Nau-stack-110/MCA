import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Pressable, Text, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { Card } from "../../components/ui/Card";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type RouteDetails = {
  distanceKm: string;
  durationMinutes: string;
};

type NearbyHospital = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
};

const DEFAULT_REGION = {
  latitude: -18.8792,
  longitude: 47.5079,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

const FALLBACK_USER_LOCATION: Coordinates = {
  latitude: -18.8792,
  longitude: 47.5079,
};

function haversineDistance(a: Coordinates, b: Coordinates) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(b.latitude - a.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);

  const computation =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(toRadians(a.latitude)) *
      Math.cos(toRadians(b.latitude)) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const angle = 2 * Math.atan2(Math.sqrt(computation), Math.sqrt(1 - computation));
  return earthRadiusKm * angle;
}

export function PatientMapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearestHospital, setNearestHospital] = useState<NearbyHospital | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinates[]>([]);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("[PatientMapScreen] expo-location removed, using fallback coordinates");
    setUserLocation(FALLBACK_USER_LOCATION);
    mapRef.current?.animateToRegion(
      {
        ...FALLBACK_USER_LOCATION,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      600
    );
    setErrorMessage(
      "Position GPS desactivee temporairement. La carte utilise une position par defaut a Antananarivo."
    );
    setIsLoadingLocation(false);
  }, []);

  const findNearestHospital = async () => {
    if (!userLocation) {
      console.log("[PatientMapScreen] Search blocked: user location unavailable");
      setErrorMessage("Position utilisateur indisponible.");
      return;
    }

    try {
      console.log("[PatientMapScreen] Starting hospital search from:", userLocation);
      setIsSearching(true);
      setErrorMessage(null);
      setNearestHospital(null);
      setRouteCoordinates([]);
      setRouteDetails(null);

      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:10000,${userLocation.latitude},${userLocation.longitude});
          way["amenity"="hospital"](around:10000,${userLocation.latitude},${userLocation.longitude});
          relation["amenity"="hospital"](around:10000,${userLocation.latitude},${userLocation.longitude});
        );
        out center tags;
      `;

      const overpassEndpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
      ];

      let overpassResponse: Response | null = null;

      for (const endpoint of overpassEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `data=${encodeURIComponent(overpassQuery)}`,
          });

          console.log("[PatientMapScreen] Overpass status:", response.status, endpoint);

          if (response.ok) {
            overpassResponse = response;
            break;
          }

          const errorText = (await response.text()).slice(0, 180);
          console.log("[PatientMapScreen] Overpass response body:", errorText);
        } catch (requestError) {
          console.log("[PatientMapScreen] Overpass request error:", requestError);
        }
      }

      if (!overpassResponse) {
        throw new Error("overpass_failed");
      }

      const overpassData = (await overpassResponse.json()) as {
        elements?: {
          id: number;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: { name?: string };
        }[];
      };

      const hospitals = (overpassData.elements ?? [])
        .map((element) => {
          const latitude = element.lat ?? element.center?.lat;
          const longitude = element.lon ?? element.center?.lon;

          if (latitude == null || longitude == null) {
            return null;
          }

          const candidate = {
            id: String(element.id),
            name: element.tags?.name || "Hopital sans nom",
            latitude,
            longitude,
            distanceKm: haversineDistance(userLocation, { latitude, longitude }),
          };

          return candidate;
        })
        .filter((hospital): hospital is NearbyHospital => hospital !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm);
      console.log("[PatientMapScreen] Nearby hospitals found:", hospitals.length);

      if (hospitals.length === 0) {
        setNearbyHospitals([]);
        setErrorMessage("Aucun hopital n'a ete trouve dans un rayon de 10 km.");
        return;
      }

      const closestHospital = hospitals[0];
      console.log("[PatientMapScreen] Closest hospital:", closestHospital);
      setNearbyHospitals(hospitals.slice(0, 5));
      setNearestHospital(closestHospital);

      const osrmResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${closestHospital.longitude},${closestHospital.latitude}?overview=full&geometries=geojson`
      );
      console.log("[PatientMapScreen] OSRM status:", osrmResponse.status);

      if (!osrmResponse.ok) {
        throw new Error("osrm_failed");
      }

      const osrmData = (await osrmResponse.json()) as {
        routes?: {
          distance: number;
          duration: number;
          geometry: { coordinates: number[][] };
        }[];
      };

      const bestRoute = osrmData.routes?.[0];

      if (!bestRoute) {
        throw new Error("route_missing");
      }

      const path = bestRoute.geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }));
      console.log("[PatientMapScreen] Route points:", path.length);

      setRouteCoordinates(path);
      setRouteDetails({
        distanceKm: (bestRoute.distance / 1000).toFixed(1),
        durationMinutes: Math.max(1, Math.round(bestRoute.duration / 60)).toString(),
      });
      console.log("[PatientMapScreen] Route summary:", {
        distanceKm: (bestRoute.distance / 1000).toFixed(1),
        durationMinutes: Math.max(1, Math.round(bestRoute.duration / 60)).toString(),
      });

      mapRef.current?.fitToCoordinates(
        [
          userLocation,
          {
            latitude: closestHospital.latitude,
            longitude: closestHospital.longitude,
          },
        ],
        {
          edgePadding: {
            top: 100,
            right: 60,
            bottom: 220,
            left: 60,
          },
          animated: true,
        }
      );
    } catch (error) {
      console.log("[PatientMapScreen] Hospital search failed:", error);
      setErrorMessage(
        "La recherche a echoue. Verifiez votre connexion internet ou reessayez dans quelques instants."
      );
    } finally {
      console.log("[PatientMapScreen] Hospital search finished");
      setIsSearching(false);
    }
  };

  return (
    <View className="flex-1 bg-[#070b12] px-4 pt-6">
      <Text className="mb-1 text-xl font-bold text-white">Carte intelligente</Text>
      <Text className="mb-4 text-sm text-slate-400">
        OpenStreetMap, Overpass et OSRM pour trouver lhopital le plus proche sans Google Directions.
      </Text>

      <Card className="mb-4">
        <Text className="text-base font-semibold text-white">Position et itineraire</Text>
        <Text className="mt-1 text-sm text-slate-400">
          Le patient est en bleu, lhopital cible en rouge et litineraire en orange.
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          Position actuelle simulee: Analakely, Antananarivo.
        </Text>

        <View className="mt-4 h-80 overflow-hidden rounded-[20px] border border-white/10 bg-[#0b1119]">
          {Platform.OS === "web" ? (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-center text-sm text-slate-300">
                La carte native nest pas disponible sur web dans cette configuration Expo. Ouvrez lapp sur Android ou iPhone pour le GPS et litineraire.
              </Text>
            </View>
          ) : (
            <MapView
              ref={(instance) => {
                mapRef.current = instance;
              }}
              style={{ flex: 1 }}
              initialRegion={DEFAULT_REGION}
              showsUserLocation={false}
              showsCompass={false}
              toolbarEnabled={false}
            >
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />

              {userLocation ? (
                <Marker
                  coordinate={userLocation}
                  title="Votre position"
                  description="Position GPS actuelle"
                  pinColor="#2563eb"
                />
              ) : null}

              {nearestHospital ? (
                <Marker
                  coordinate={{
                    latitude: nearestHospital.latitude,
                    longitude: nearestHospital.longitude,
                  }}
                  title={nearestHospital.name}
                  description="Hopital le plus proche"
                  pinColor="#dc2626"
                />
              ) : null}

              {routeCoordinates.length > 1 ? (
                <Polyline coordinates={routeCoordinates} strokeColor="#f97316" strokeWidth={5} />
              ) : null}
            </MapView>
          )}

          {(isLoadingLocation || isSearching) ? (
            <View className="absolute inset-0 items-center justify-center bg-[#0b1119]/80">
              <ActivityIndicator color="#f97316" />
              <Text className="mt-3 text-sm text-slate-300">
                {isLoadingLocation
                  ? "Initialisation de la carte..."
                  : "Recherche de lhopital et calcul de litineraire..."}
              </Text>
            </View>
          ) : null}
        </View>

        {routeDetails && nearestHospital ? (
          <View className="mt-4 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
            <Text className="text-sm font-semibold text-white">{nearestHospital.name}</Text>
            <Text className="mt-1 text-slate-300">
              Distance estimee: {routeDetails.distanceKm} km
            </Text>
            <Text className="mt-1 text-slate-300">
              Temps de trajet: {routeDetails.durationMinutes} min
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
            <Text className="text-sm text-red-200">{errorMessage}</Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Pressable
            onPress={findNearestHospital}
            disabled={isLoadingLocation || isSearching}
            className={`items-center rounded-2xl px-4 py-4 ${
              isLoadingLocation || isSearching ? "bg-slate-800" : "bg-[#1d4ed8]"
            }`}
          >
            <Text className="text-base font-semibold text-white">Trouver lhopital le plus proche</Text>
          </Pressable>
        </View>
      </Card>

      <FlatList
        data={nearbyHospitals}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Card className="mb-3">
            <Text className="text-sm text-slate-400">
              Lancez la recherche pour lister les hopitaux detectes dans un rayon de 10 km.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-start justify-between">
              <View className="max-w-[70%]">
                <Text className="text-base font-semibold text-white">{item.name}</Text>
                <Text className="mt-1 text-slate-400">Distance a vol doiseau: {item.distanceKm.toFixed(2)} km</Text>
              </View>
              <Text className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                OSM
              </Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
