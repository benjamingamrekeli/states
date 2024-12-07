import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {SvgUri} from "react-native-svg";
import State from "../types";
import { getStates } from "../api";

const Index = () => {
  const [states, setStates] = useState<State[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStates = async () => {
      const data = await getStates();//kan miss alles hierin ipv aparte api.tsx file
      setStates(data);
    };
    fetchStates();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={states}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push({ pathname: "/state/[id]", params: { id: item.id.toString() } })}
          >
            <SvgUri uri={item.flag} style={styles.flag}/>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  flag: { maxWidth: 50, maxHeight: 30, marginRight: 12},
  name: { fontSize: 16, fontWeight: "bold" },
});

export default Index;

//TODO
//expo filesystem/asyncstorage gebruiken