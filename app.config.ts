import type { ExpoConfig } from "expo/config";

/** Native IDs for App Store / Play Store — keep in sync with your signing setup. */
const IOS_BUNDLE_ID = "com.mobilegis.app";
const ANDROID_PACKAGE = "com.mobilegis.app";

const config: ExpoConfig = {
  name: "MobileGIS",
  slug: "mobilegis",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mobilegis",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_ID,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "MobileGIS uses your location to record coordinates for field data collection.",
      NSCameraUsageDescription:
        "MobileGIS can use the camera when you attach photos to field records.",
      NSPhotoLibraryUsageDescription:
        "MobileGIS can access photos when you attach images to records.",
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: ANDROID_PACKAGE,
    versionCode: 1,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
    usesCleartextTraffic: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: { origin: false },
  },
};

export default config;
