import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SvgUri } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import State from "../../types";
import { getStates } from "../../api";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const StateDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const data = await getStates();
        const selectedState = data.find((s: any) => s.id === Number(id));
        if (selectedState) {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?state=${selectedState.name}&country=USA&format=json`,
            {
              headers: {
                "User-Agent": "YourAppName/1.0 (your-email@example.com)",
              },
            }
          );
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            setState({
              ...selectedState,
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            });
          } else {
            setState(selectedState);
          }
        } else {
          setState(null);
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
        setState(null);
      } finally {
        setLoading(false);
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
      mediaTypes: ["images", "videos"],
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

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  if (!state || state.latitude === undefined || state.longitude === undefined)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>State not found</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.flagContainer}>
        <SvgUri uri={state.flag} style={styles.flag} />
      </View>
      <Text style={styles.name}>{state.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Capital:</Text>
        <Text style={styles.infoText}>{state.capital}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Largest City:</Text>
        <Text style={styles.infoText}>{state.largest_city}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Admitted to Union:</Text>
        <Text style={styles.infoText}>{state.admitted_to_union}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Population:</Text>
        <Text style={styles.infoText}>{state.population}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/map/${state.id}`)}
        >
          <AntDesign name="enviromento" size={20} color="#fff" />
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <AntDesign name="clouduploado" size={20} color="#fff" />
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f8ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  flagContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  flag: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e8b57",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    margin: 6,
    borderRadius: 8,
  },
});

export default StateDetails;
