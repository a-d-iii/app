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

## Troubleshooting

### NDK missing `source.properties`
If the Android build fails with:
```
[CXX1101] NDK at <path> did not have a source.properties file
```
reinstall the specified NDK using `sdkmanager` or Android Studio and verify that the folder contains a `source.properties` file.
