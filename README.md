# VIT Student App

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the project:
   ```bash
   npm run android
   ```

Make sure you have the Expo CLI installed and Android SDK configured.

### New Architecture

This project previously enabled React Native's New Architecture. Running in
**Expo Go** does not support that setup, so `newArchEnabled` is disabled by
default (see `app.json` and `android/gradle.properties`). If you need to use the
new architecture or any native modules that aren't included with Expo Go, create
a development build as described in the Expo docs:
<https://docs.expo.dev/develop/development-builds/create-a-build/>
