import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const [showStartupSplash, setShowStartupSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupSplash(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    void (async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      if (fg.status !== "granted") {
        return;
      }
      await Location.requestBackgroundPermissionsAsync();
    })();
  }, []);

  if (showStartupSplash) {
    return (
      <View style={styles.splashWrap}>
        <Image
          source={require("../assets/images/splash.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
        <Text style={styles.credit}>
          Developed by Nigel Onai Rodrick SIbanda. Southern Region ZETDC
        </Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splashWrap: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  splashImage: {
    width: 112,
    height: 112,
    marginBottom: 12,
  },
  credit: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: 280,
  },
});
