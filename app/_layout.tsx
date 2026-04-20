import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const [showStartupSplash, setShowStartupSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
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
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  credit: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    textAlign: "center",
    fontWeight: "600",
  },
});
