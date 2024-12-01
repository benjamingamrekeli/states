import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Outlet, createBrowserRouter, RouterProvider, Route, NavLink } from "react-router-dom";
import State from "./types"

const Root = () => {
  return (
      <View>
        <View>
                <NavLink to="/" >Home</NavLink>
                <NavLink to="page1">Page 1</NavLink>
                <NavLink to="page2">Page 2</NavLink>
            </View>
            <View>
                <Outlet/>
            </View>
      </View>
  );
}

const Home = () => {
  return (
      <View>This is the home page!</View>
  );
}

const Page1 = () => {
  return (
      <View>Page 1</View>
  );
}

const Page2 = () => {
  return (
      <View>Page 2</View>
  );
}

export default function App() {
  const [states, setStates] = useState<State[]>();
  useEffect(()=> {
    const loadData = async() => {
      const data = await fetch("https://sampleapis.assimilate.be/thestates/states");
      const json = await data.json();
      setStates(json);
    }
    loadData();
  }, []);

  const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "page1",
                element: <Page1/>
            },
            {
                path: "page2",
                element: <Page2/>
            }
        ]
    }
]);
  return (
    <View style={styles.container}>
      <RouterProvider router={router}/>
      <Text>Open up App.tsx to  on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
