import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {SvgUri} from "react-native-svg";
import State from "../../types";
import { getStates } from "../../api";

const StateDetails = () => {
  const { id } = useLocalSearchParams(); // Gebruik de juiste hook
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      const data = await getStates();
      const selectedState = data.find((s: any) => s.id === Number(id));
      console.log(data); // Controleer de inhoud van de data
      setState(selectedState || null);
    };
    fetchState();
  }, [id]);

  if (!state) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <SvgUri uri={state.flag} width="100%" height="200" />
      <Text style={styles.name}>{state.name}</Text>
      <Text>Capital: {state.capital}</Text>
      <Text>Largest City: {state.largest_city}</Text>
      <Text>Admitted to Union: {state.admitted_to_union}</Text>
      <Text>Population: {state.population}</Text>
      <Button
        title="Zie locatie"
        onPress={() => router.push(`/map/${state.id}`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  flag: { width: 200, height: 200, resizeMode: "contain" },
  name: { fontSize: 24, fontWeight: "bold", marginVertical: 8 },
});

export default StateDetails;
