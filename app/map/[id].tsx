import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import State from "../../types";
import { getStates } from "../../api";
import axios from 'axios';

const MapPage = () => {
  const { id } = useLocalSearchParams(); // Gebruik de juiste hook
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      console.log("Fetching state data...");
      try {
        const data = await getStates();
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
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: state.latitude || 37.7749, // Default to San Francisco if no latitude
          longitude: state.longitude || -122.4194, // Default to San Francisco if no longitude
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {state && state.latitude !== undefined && state.longitude !== undefined && (
          <Marker
            coordinate={{
              latitude: state.latitude,
              longitude: state.longitude,
            }}
            pinColor="red" // Ensure a valid color is used here
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default MapPage;