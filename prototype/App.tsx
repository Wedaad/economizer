import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import HomeScreen from './app/screens/HomeScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import LoginScreen from './app/screens/LoginScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import MenuBar from './app/components/MenuBar';
import auth from '@react-native-firebase/auth';
import { AppProvider } from './app/context/AppContext';

export default function App() {

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const Stack = createNativeStackNavigator();

    //  Handle user state changes
    function onAuthStateChanged(user: any) {

      setUser(user);
    
      if (initializing) {

        setInitializing(false);
      }
    }

    useEffect(() => {

      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      

      return () => {
      
        subscriber // unsubscribe on unmount
      }
      }, []);

    if (initializing) {
      
      return null;

    }

    // If the user is logged out 
    if (!user) {
      return (
        <>
          <AppProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {/* HOME SCREEN */}
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "eConomizer" }}
              />
              {/* SIGN UP SCREEN*/}
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: 'Create Account' }} />
              {/* LOGIN SCREEN*/}
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login' }} />
            </Stack.Navigator>
          </NavigationContainer>
          </AppProvider>
        </>
      );

    } else { // user is logged in
    
        return (
          <AppProvider>
            <NavigationContainer>
              <MenuBar id={user.uid}/>
            </NavigationContainer>
          </AppProvider>
        );
    }

}
