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
import firestore from '@react-native-firebase/firestore';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function App() {

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState({uid: ''});
    const Stack = createNativeStackNavigator();

    //  Handle user state changes
    // from firebase react native docs: https://rnfirebase.io/auth/usage
    function onAuthStateChanged(user: any) {

      setUser(user);
    
      if (initializing) {

        setInitializing(false);
      }
    } 
    console.log(user);
    // listening for dynamic link clicks
    // from react-native-dynamic-links documentation https://rnfirebase.io/dynamic-links/usage#listening-for-dynamic-links
    const handleDynamicLink = (link) => {

      const groupID = link.url.split("/")[4]; // getting the budget ID from the link passed in 
      const jointBudgetsRef = firestore().collection('JointBudgets').doc(groupID);
      const savingsCollectRef = firestore().collection('Savings').doc(groupID);

      if(link.url) { // if link.url exists and not null
          console.log(user.uid);
          if(user.uid === '') {
            console.log("error: user ID is empty");

          } else {
       
            savingsCollectRef.update({
              goalMembers: firestore.FieldValue.arrayUnion(user.uid), // updating the savings goal document
          
            })

            jointBudgetsRef.update({
                budgetMembers: firestore.FieldValue.arrayUnion(user.uid), // updating the joint budget document
        
            })

          }
      }
    }

    useEffect(() => {

      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      // from react-native-dynamic-links documentation https://rnfirebase.io/dynamic-links/usage#listening-for-dynamic-links
      const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
   
      return () => {
      
        subscriber // unsubscribe on unmount
        unsubscribe();
      }
    }, [user]);

    

    if (initializing) {
      
      return null;

    }

    // If the user is logged out 
    if (!user) {
      return (
        <>
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
        </>
      );

    } else { // user is logged in


      
        return (
          <AppProvider>
            <NavigationContainer>
              {/* Bottom tab navigator (menubar for navigation)*/}
              <MenuBar id={user.uid}/>  
            </NavigationContainer>
          </AppProvider>
        );
    }

}
