import type { ObservationMapPin } from "../lib/db";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  userCoords: { latitude: number; longitude: number } | null;
  pins: ObservationMapPin[];
};

function openInExternalMaps(latitude: number, longitude: number) {
  const lat = latitude.toFixed(6);
  const lon = longitude.toFixed(6);
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?ll=${lat},${lon}`
      : Platform.OS === "android"
        ? `geo:${lat},${lon}?q=${lat},${lon}`
        : osm;
  void Linking.openURL(url).catch(() => {
    void Linking.openURL(osm);
  });
}

export function LocationReadout({ userCoords, pins }: Props) {
  const hasAny =
    userCoords != null ||
    pins.length > 0;

  if (!hasAny) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Get a GPS fix above, or save a record with “Attach GPS” on the Collect
          tab to list coordinates here — no map SDK required.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {userCoords ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current position</Text>
          <Text style={styles.coords}>
            {userCoords.latitude.toFixed(6)}, {userCoords.longitude.toFixed(6)}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
            onPress={() =>
              openInExternalMaps(userCoords.latitude, userCoords.longitude)
            }
          >
            <Text style={styles.linkBtnText}>Open in Maps / OSM</Text>
          </Pressable>
        </View>
      ) : null}

      {pins.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Saved points ({pins.length})
          </Text>
          <ScrollView
            style={styles.pinScroll}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {pins.map((p) => (
              <View key={`${p.namespace}-${p.id}`} style={styles.pinRow}>
                <View style={styles.pinText}>
                  <Text style={styles.pinTitle} numberOfLines={1}>
                    #{p.id} {p.title}
                  </Text>
                  <Text style={styles.pinCoords}>
                    {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.pinLink,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => openInExternalMaps(p.latitude, p.longitude)}
                >
                  <Text style={styles.pinLinkText}>Open</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, marginBottom: 8 },
  empty: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#eef2f0",
    padding: 16,
    justifyContent: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0c6b4d",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  coords: {
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    color: "#111827",
    marginBottom: 10,
  },
  linkBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfdf5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0c6b4d",
  },
  linkBtnText: { color: "#0c6b4d", fontWeight: "600", fontSize: 14 },
  pressed: { opacity: 0.88 },
  pinScroll: { maxHeight: 220 },
  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  pinText: { flex: 1, paddingRight: 8 },
  pinTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  pinCoords: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  pinLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  pinLinkText: { color: "#0c6b4d", fontWeight: "600", fontSize: 13 },
});
