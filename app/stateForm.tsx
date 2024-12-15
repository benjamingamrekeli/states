import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addState, updateState } from "../api";
import State from "../types";

const StateForm = ({ existingState }: { existingState?: State }) => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [stateData, setStateData] = useState<State>(
    existingState || {
      id: 0,
      name: "",
      abv: "",
      capital: "",
      largest_city: "",
      admitted_to_union: "",
      population: "0",
      flag: "",
    }
  );

  const handleChange = (key: keyof State, value: string | number) => {
    setStateData({ ...stateData, [key]: value });
  };

  const handleSubmit = async () => {
    // Simple validation (adjust as needed)
    if (!stateData.name || !stateData.capital || !stateData.population) {
      alert("Please fill out all required fields.");
      return;
    }
  
    try {
      if (id) {
        // Update existing state
        await updateState(Number(id), stateData);
        alert("State updated successfully");
      } else {
        // Add new state
        const { id, ...newStateData } = stateData; // Exclude 'id' from newStateData
        await addState(newStateData);
        alert("State added successfully");
      }
      router.push("/");
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      alert(`Failed to save state: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={stateData.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Abbreviation"
        value={stateData.abv}
        onChangeText={(text) => handleChange("abv", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Capital"
        value={stateData.capital}
        onChangeText={(text) => handleChange("capital", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Largest City"
        value={stateData.largest_city}
        onChangeText={(text) => handleChange("largest_city", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Admitted to Union"
        value={stateData.admitted_to_union}
        onChangeText={(text) => handleChange("admitted_to_union", text)}
      />
      <TextInput
  style={styles.input}
  placeholder="Population"
  value={stateData.population.toString()}
  onChangeText={(text) => handleChange("population", text)}
  keyboardType="numeric"
/>
      <TextInput
        style={styles.input}
        placeholder="Flag URL"
        value={stateData.flag}
        onChangeText={(text) => handleChange("flag", text)}
      />
      <Button title="Save State" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12, padding: 8 },
});

export default StateForm;