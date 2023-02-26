import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import HomeScreen from './app/screens/HomeScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import LoginScreen from './app/screens/LoginScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import MenuBar from './app/components/MenuBar';
import auth from '@react-native-firebase/auth';
import { AppProvider } from './app/context/AppContext';

export default function App() {
  console.log("App Running");


   // Set an initializing state whilst Firebase connects
   const [initializing, setInitializing] = useState(true);
   const [user, setUser] = useState();
   const Stack = createNativeStackNavigator();

  //  Handle user state changes
  function onAuthStateChanged(user: any) {

    setUser(user);
    // console.log(user);
   
    if (initializing) {

      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    
    return null;

  }

  // If the user is logged out 
  if (!user) {
    return (
      // <View>
      //   <Text>Login</Text>
      // </View>
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
    // console.log("Logged in user is: " + user.uid);
      return (
        <AppProvider>
          <NavigationContainer>
            <MenuBar id={user.uid}/>
          </NavigationContainer>
        </AppProvider>
      );
  }

  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       {/* HOME SCREEN */}
  //       <Stack.Screen
  //         name="Home"
  //         component={HomeScreen}
  //         options={{ title: "eConomizer" }} />
  //       {/* SIGN UP SCREEN*/}
  //       <Stack.Screen
  //         name="SignUp"
  //         component={SignUpScreen}
  //         options={{ title: 'Create Account' }} />
  //       {/* LOGIN SCREEN*/}
  //       <Stack.Screen
  //         name="Login"
  //         component={LoginScreen}
  //         options={{ title: 'Login' }} />
  //       {/* LINK BANK ACCOUNT */}
  //       <Stack.Screen
  //         name="LinkAccount"
  //         component={LinkAccountScreen}
  //         options={{ title: "Link Your Bank Account" }} />
  //       {/* VIEW TRANSACTIONS */}
  //       <Stack.Screen
  //         name="Trasactions"
  //         component={ViewTransactions}
  //         options={{ title: "Transactions" }} />
  //       {/* VIEW BUDGETS */}
  //       <Stack.Screen
  //         name="Budgets"
  //         component={BudgetsScreen}
  //         options={{ title: "Budgets" }} />
  //       {/* USER DASHBOARD */}
  //       <Stack.Screen
  //         name="Dashboard"
  //         component={UserDashboardScreen}
  //         options={{ title: "Dashboard" }} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

const styles = StyleSheet.create({

  screenLayout: {
      // borderWidth: 4,
      // borderColor: 'orange',
      flex: 1,
      backgroundColor: 'white',
      paddingTop: 30,
      paddingHorizontal: 20,
  },

  btncontainer: {
      // borderWidth: 4,
      // borderColor: 'green',
      // marginTop: 280,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
  },

  title: {
      // borderWidth: 4,
      // borderColor: 'red',
      padding: 8, 
      fontSize: 24,
      fontWeight: "bold",
  },

  btns: {
      flex: 1,
      margin: 10,
  },
});
