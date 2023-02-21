import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome5  } from '@expo/vector-icons';

// importing screens
import BudgetsScreen from '../screens/BudgetsScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import SignOutScreen from '../screens/SignOutScreen';
import ViewTransactions from '../screens/ViewTransactions';

// creating tab navigator
const Tab = createBottomTabNavigator(); 


export default function MenuBar() {

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
      // initialRouteName={"home"}
      // initialRouteName={userDashboard}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {

          let iconName;
          if(route.name === "Dashboard") {

            iconName = focused ? 'home' : 'home-outline';

          } else if(route.name === "Budgets") {

            iconName = focused ? 'md-wallet' : 'md-wallet-outline';

          } else if(route.name === "Logout") {

              iconName = focused ? 'logout' : 'logout';
              return <MaterialIcons name={iconName} size={size} color={color} />

          } else if(route.name === "Transactions") {

            iconName = focused ? 'money-bill-wave' : 'money-bill-wave';
            return <FontAwesome5 name={iconName} size={size} color={color} />
        }

          return <Ionicons name={iconName} size={size} color={color}/>

        },
          tabBarActiveTintColor: 'purple',
          tabBarInactiveTintColor: 'gray',
      })}>

        <Tab.Screen name="Dashboard" component={UserDashboardScreen} />
        <Tab.Screen name="Budgets" component={BudgetsScreen} />
        <Tab.Screen name="Transactions" component={ViewTransactions} />
        <Tab.Screen name="Logout" component={SignOutScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
