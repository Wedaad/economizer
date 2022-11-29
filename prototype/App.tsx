import React from 'react';
import HomeScreen from './app/screens/HomeScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import LoginScreen from './app/screens/LoginScreen';
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
        {/* SIGN UP SCREEN*/}
        <Stack.Screen 
          name="SignUp"
          component={SignUpScreen}
          options={{title:'Create Account'}} />
        {/* LOGIN SCREEN*/}
        <Stack.Screen 
          name="Login"
          component={LoginScreen}
          options={{title:'Login'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
