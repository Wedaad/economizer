import React from 'react';
import HomeScreen from './app/screens/HomeScreen';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  console.log("App Running");

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* HOME SCREEN */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "eConomizer"}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
