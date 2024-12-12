import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SvgUri } from "react-native-svg";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import State from "../../types";
import { getStates } from "../../api";
import axios from 'axios';

const StateDetails = () => {
  const { id } = useLocalSearchParams(); // Gebruik de juiste hook
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

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

    const loadImages = async () => {
      try {
        const savedImages = await AsyncStorage.getItem(`images_${id}`);
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    fetchState();
    loadImages();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images","videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images, result.assets[0].uri];
      setImages(newImages);
      await AsyncStorage.setItem(`images_${id}`, JSON.stringify(newImages));
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!state || state.latitude === undefined || state.longitude === undefined) return <Text>State not found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Button title="Upload Image" onPress={pickImage} />
      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  flag: { width: 200, height: 200, resizeMode: "contain" },
  name: { fontSize: 24, fontWeight: "bold", marginVertical: 8 },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 16 },
  image: { width: 100, height: 100, margin: 4 },
});

export default StateDetails;
