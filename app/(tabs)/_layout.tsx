import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  return ({
    color,
    size,
  }: {
    color: string;
    size: number;
  }) => <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0c6b4d",
        tabBarInactiveTintColor: "#6b7280",
        headerTitle: "MobileGIS",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home-outline"),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Location",
          tabBarIcon: tabIcon("location-outline"),
        }}
      />
      <Tabs.Screen
        name="collect"
        options={{
          title: "Collect",
          tabBarIcon: tabIcon("create-outline"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("settings-outline"),
        }}
      />
    </Tabs>
  );
}
