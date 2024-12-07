import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import State from "../../types";
import { getStates } from "../../api";

const MapPage = () => {
  const { id } = useLocalSearchParams(); // Gebruik de juiste hook
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      const data = await getStates();
      const selectedState = data.find((s:any) => s.id === Number(id));
      setState(selectedState || null);
    };
    fetchState();
  }, [id]);

  if (!state) return <Text>Loading...</Text>;

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.8, // Simpele locatie, echte data vereist meer logica
        longitude: -95.9,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
    >
      <Marker
        coordinate={{
          latitude: 37.8,
          longitude: -95.9,
        }}
        title={state.name}
      />
    </MapView>
  );
};

export default MapPage;
