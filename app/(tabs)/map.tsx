import { LocationReadout } from "../../components/LocationReadout";
import {
  listMeterPins,
  listObservationPins,
  type ObservationMapPin,
} from "../../lib/db";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MapScreen() {
  const [permission, setPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [pins, setPins] = useState<ObservationMapPin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshingPins, setRefreshingPins] = useState(false);

  const loadPins = useCallback(async () => {
    const [obs, meters] = await Promise.all([
      listObservationPins(),
      listMeterPins(),
    ]);
    setPins([...obs, ...meters]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPins();
    }, [loadPins])
  );

  const onRefreshPins = useCallback(async () => {
    setRefreshingPins(true);
    try {
      await loadPins();
    } finally {
      setRefreshingPins(false);
    }
  }, [loadPins]);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status);
      if (status !== "granted") {
        setCoords(null);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords(pos.coords);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Location error");
    } finally {
      setLoading(false);
    }
  }, []);

  const userCoords =
    coords != null
      ? { latitude: coords.latitude, longitude: coords.longitude }
      : null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshingPins}
          onRefresh={onRefreshPins}
          tintColor="#0c6b4d"
          colors={["#0c6b4d"]}
        />
      }
    >
      <Text style={styles.title}>Location</Text>
      <Text style={styles.sub}>
        GPS readouts for data collection — no embedded map or Google APIs. Use
        “Open in Maps / OSM” to preview a point in Apple Maps, Google Maps
        (device default), or the browser.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={refresh}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get current position</Text>
        )}
      </Pressable>

      <LocationReadout userCoords={userCoords} pins={pins} />

      <Text style={styles.pinsMeta}>
        Saved points with coordinates: {pins.length}
      </Text>

      <View style={styles.panel}>
        <Text style={styles.label}>Permission</Text>
        <Text style={styles.value}>{permission ?? "—"}</Text>
        <Text style={[styles.label, styles.mt]}>Latitude</Text>
        <Text style={styles.value}>
          {coords?.latitude != null ? coords.latitude.toFixed(6) : "—"}
        </Text>
        <Text style={[styles.label, styles.mt]}>Longitude</Text>
        <Text style={styles.value}>
          {coords?.longitude != null ? coords.longitude.toFixed(6) : "—"}
        </Text>
        {error ? <Text style={styles.err}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f8faf9" },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0c6b4d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  pinsMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  label: { fontSize: 12, color: "#9ca3af", textTransform: "uppercase" },
  value: { fontSize: 16, color: "#111827", fontVariant: ["tabular-nums"] },
  mt: { marginTop: 12 },
  err: { marginTop: 12, color: "#b91c1c", fontSize: 14 },
});
