import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, LogBox } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SvgUri } from "react-native-svg";
import State from "../../types";
import { getStates } from "../../api";
import axios from 'axios';

const StateDetails = () => {
  const { id } = useLocalSearchParams(); // Gebruik de juiste hook
  const router = useRouter();
  console.log("StateDetails rendering, id:", id); // Log to verify id retrieval

  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect running, id:", id); // Log to check if useEffect is running

    const fetchState = async () => {
      console.log("Fetching state data...");
      try {
        const data = await getStates();
        console.log("States data:", data);
        const selectedState = data.find((s: any) => s.id === Number(id));
        console.log("Selected state:", selectedState);
        if (selectedState) {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?state=${selectedState.name}&country=USA&format=json`, {
            headers: {
              'User-Agent': 'YourAppName/1.0 (your-email@example.com)'
            }
          });
          console.log("Nominatim response:", response.data);
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            setState({ ...selectedState, latitude: parseFloat(lat), longitude: parseFloat(lon) });
            console.log("State set with coordinates:", { ...selectedState, latitude: parseFloat(lat), longitude: parseFloat(lon) });
          } else {
            setState(null);
            console.log("No coordinates found for the selected state.");
          }
        } else {
          setState(null);
          console.log("No state found with the given ID.");
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
        setState(null);
      } finally {
        setLoading(false);
        console.log("Loading state set to false.");
      }
    };
    fetchState();
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (!state || state.latitude === undefined || state.longitude === undefined) return <Text>State not found</Text>;

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
