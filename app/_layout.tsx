import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      {/* Standaard homepagina */}
      <Stack.Screen name="index" options={{ title: "Statenlijst" }} />

      {/* Dynamische routes zoals /state/[id] */}
      <Stack.Screen name="state/[id]" options={{ title: "Staat Details" }} />

      {/* Dynamische routes zoals /map/[id] */}
      <Stack.Screen name="map/[id]" options={{ title: "Staat Locatie" }} />
    </Stack>
  );
};

export default RootLayout;
