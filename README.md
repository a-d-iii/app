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

Expo Go always runs with React Native's New Architecture enabled. Earlier
versions of this project explicitly set `newArchEnabled: false` in `app.json`,
but that setting is no longer required and has been removed. If you need to use
native modules that aren't included with Expo Go, create a development build as
described in the Expo docs:
<https://docs.expo.dev/develop/development-builds/create-a-build/>
