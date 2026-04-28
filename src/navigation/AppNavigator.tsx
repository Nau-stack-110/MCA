import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { RoleSelectionScreen } from "../screens/RoleSelectionScreen";
import { PatientHomeScreen } from "../screens/patient/PatientHomeScreen";
import { PatientMapScreen } from "../screens/patient/PatientMapScreen";
import { AmbulanceTrackingScreen } from "../screens/patient/AmbulanceTrackingScreen";
import { MedicalHistoryScreen } from "../screens/patient/MedicalHistoryScreen";
import { ChatbotScreen } from "../screens/patient/ChatbotScreen";
import { VideoCallScreen } from "../screens/common/VideoCallScreen";
import { DoctorDashboardScreen } from "../screens/doctor/DoctorDashboardScreen";
import { PatientDetailScreen } from "../screens/doctor/PatientDetailScreen";
import { NotificationsScreen } from "../screens/doctor/NotificationsScreen";

type Role = "patient" | "doctor";
type AuthMode = "login" | "register";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#f97316",
    background: "#070b12",
    card: "#0f1722",
    text: "#ffffff",
    border: "#1e293b",
    notification: "#dc2626",
  },
};

function PatientTabs({ openChatbot, openVideoCall }: { openChatbot: () => void; openVideoCall: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0f1722",
          borderTopColor: "#1e293b",
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Accueil: "home",
            Hopitaux: "map",
            Ambulance: "car",
            Historique: "document-text",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil">
        {() => <PatientHomeScreen openChatbot={openChatbot} openVideoCall={openVideoCall} />}
      </Tab.Screen>
      <Tab.Screen name="Hopitaux" component={PatientMapScreen} />
      <Tab.Screen name="Ambulance" component={AmbulanceTrackingScreen} />
      <Tab.Screen name="Historique" component={MedicalHistoryScreen} />
    </Tab.Navigator>
  );
}

function DoctorTabs({ openPatient }: { openPatient: (id: string) => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0f1722",
          borderTopColor: "#1e293b",
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "pulse",
            "Video Call": "videocam",
            Notifications: "notifications",
            Urgence: "warning",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard">{() => <DoctorDashboardScreen openPatient={openPatient} />}</Tab.Screen>
      <Tab.Screen name="Video Call" component={VideoCallScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Urgence">{() => <PatientMapScreen />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<Role | null>(null);

  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(undefined);

  const authScreen = useMemo(() => {
    if (authMode === "login") {
      return (
        <LoginScreen
          onLogin={() => setIsAuthenticated(true)}
          goToRegister={() => setAuthMode("register")}
        />
      );
    }
    return (
      <RegisterScreen
        onRegister={() => setIsAuthenticated(true)}
        goToLogin={() => setAuthMode("login")}
      />
    );
  }, [authMode]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth">{() => authScreen}</Stack.Screen>
        ) : !role ? (
          <Stack.Screen name="RoleSelect">
            {() => <RoleSelectionScreen onSelectRole={setRole} />}
          </Stack.Screen>
        ) : role === "patient" ? (
          <>
            <Stack.Screen name="PatientTabs">
              {({ navigation }) => (
                <PatientTabs
                  openChatbot={() => navigation.navigate("Chatbot")}
                  openVideoCall={() => navigation.navigate("VideoCall")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DoctorTabs">
              {({ navigation }) => (
                <DoctorTabs
                  openPatient={(id) => {
                    setSelectedPatient(id);
                    navigation.navigate("PatientDetail");
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="PatientDetail">
              {() => <PatientDetailScreen patientId={selectedPatient} />}
            </Stack.Screen>
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
