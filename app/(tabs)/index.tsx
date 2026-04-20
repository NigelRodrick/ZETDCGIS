import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MobileGIS</Text>
      <Text style={styles.tagline}>Field data collection for iOS &amp; Android</Text>
      <Text style={styles.lead}>
        Structured forms, GPS coordinates, offline SQLite storage, and CSV export
        — one app for iOS and Android. No map SDKs bundled.
      </Text>

      <View style={styles.links}>
        <Link href="/map" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>Location</Text>
            <Text style={styles.cardBody}>
              GPS readouts and saved points; open any coordinate in Maps or
              OpenStreetMap
            </Text>
          </Pressable>
        </Link>
        <Link href="/collect" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>Collect</Text>
            <Text style={styles.cardBody}>
              Field forms, attach coordinates, export CSV
            </Text>
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardBody}>App info and bundle identifiers</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8faf9",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0c6b4d",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 12,
  },
  lead: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 20,
  },
  links: {
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0c6b4d",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});
