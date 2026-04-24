import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const formSections = [
    {
      title: "Meter",
      body: "Capture meter details and related field observations.",
      collectHref: { pathname: "/collect", params: { form: "meter" } } as const,
      viewHref: { pathname: "/collect", params: { form: "meter", focus: "list" } } as const,
    },
    {
      title: "Pole",
      body: "Record pole condition, location, and maintenance notes.",
      collectHref: { pathname: "/collect", params: { form: "pole" } } as const,
      viewHref: { pathname: "/collect", params: { form: "pole", focus: "list" } } as const,
    },
    {
      title: "Switchgear",
      body: "Document switchgear status, checks, and remarks.",
      collectHref: { pathname: "/collect", params: { form: "switchgear" } } as const,
      viewHref: { pathname: "/collect", params: { form: "switchgear", focus: "list" } } as const,
    },
    {
      title: "Transformer",
      body: "Collect transformer attributes, condition, and comments.",
      collectHref: { pathname: "/collect", params: { form: "transformer" } } as const,
      viewHref: {
        pathname: "/collect",
        params: { form: "transformer", focus: "list" },
      } as const,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Forms</Text>
      <View style={styles.sections}>
        {formSections.map((section) => {
          const isTransformer = section.title === "Transformer";
          return (
          <View key={section.title} style={styles.card}>
            <Pressable
              style={({ pressed }) => [styles.cardMain, pressed && styles.pressed]}
              onPress={() => router.push(section.collectHref)}
            >
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardBody}>{section.body}</Text>
            </Pressable>
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
                onPress={() => router.push(section.collectHref)}
              >
                <Text style={styles.primaryBtnText}>Collect</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  isTransformer && styles.secondaryBtnBlack,
                  pressed && styles.pressed,
                ]}
                onPress={() => router.push(section.viewHref)}
              >
                <Text style={styles.secondaryBtnText}>Open</Text>
              </Pressable>
            </View>
          </View>
        )})}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8faf9",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  sections: {
    gap: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#0047d6",
    borderRadius: 12,
    padding: 0,
    borderWidth: 2,
    borderColor: "#0030a8",
    shadowColor: "#001a5c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  cardMain: {
    padding: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
    opacity: 0.95,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  primaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#001a4d",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  secondaryBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryBtnBlack: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  pressed: {
    opacity: 0.9,
  },
});
