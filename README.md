# MCA

Application Expo de triage medical avec dashboard patient, ecran chatbot et parcours medecin.

## Demarrage

1. Installer les dependances

   ```bash
   npm install
   ```

2. Lancer l'app

   ```bash
   npx expo start
   ```

## Chatbot OpenRouter

Le chatbot peut fonctionner de 2 manieres :

- Sans configuration : reponses locales de secours.
- Avec OpenRouter : reponses IA via `openrouter/free` par defaut.

Configuration :

```bash
cp .env.example .env
```

Puis renseigner au minimum :

```bash
EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
```

Variables disponibles :

- `EXPO_PUBLIC_OPENROUTER_API_KEY`
- `EXPO_PUBLIC_OPENROUTER_MODEL`
- `EXPO_PUBLIC_OPENROUTER_APP_TITLE`
- `EXPO_PUBLIC_OPENROUTER_REFERER`

Important :

- les variables `EXPO_PUBLIC_*` sont embarquees cote client dans Expo
- pour une app de production, il vaut mieux passer par un backend/proxy afin de proteger la cle API

## Environnements de lancement

Dans la sortie, Expo propose notamment :

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
