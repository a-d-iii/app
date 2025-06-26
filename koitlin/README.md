# Basic Android App

This repository contains a minimal Android application written in Kotlin using Jetpack Compose. It displays a simple "Hello Android!" message.

## Building

The Gradle wrapper scripts (`gradlew` and `gradlew.bat`) are included without the
`gradle-wrapper.jar` binary. When you run `./gradlew` for the first time, the
wrapper will download the required jar automatically. Ensure the Android SDK is
available on your system and then execute:

```bash
./gradlew assembleDebug
```

You can also open the project directory directly in Android Studio and run the
app on an emulator from there.
