import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto , MaterialIcons, FontAwesome5, MaterialCommunityIcons  } from '@expo/vector-icons';

// importing screens
import UserDashboardScreen from '../screens/UserDashboardScreen';
import SignOutScreen from '../screens/SignOutScreen';
import ViewTransactions from '../screens/ViewTransactions';
import LinkAccountScrceen from '../screens/LinkAccountScreen';
import SavingsScreen from '../screens/SavingsScreen';

// creating tab navigator
const Tab = createBottomTabNavigator(); 

// custom tab button for adding budget
const CustomAddBudgetButton = ({children, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow}}
  >
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      elevation: 5,
      backgroundColor: '#8B19FF'
    }}>
      {children}
    </View>
  </TouchableOpacity>

);


export default function MenuBar(currentUser) {

  return (
      <Tab.Navigator
      screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            bottom: 10,
            left: 15,
            right: 15,
            height: 65,
            elevation: 3,
            borderRadius: 15,
            borderColor: 0,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#8B19FF',
          tabBarInactiveTintColor: 'gray',
      }}>

        <Tab.Screen name="Dashboard" component={UserDashboardScreen} 
        initialParams={{userID: currentUser.id}}
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <View style={styles.tabIcon}>
              <FontAwesome5 
              name="chart-pie" 
              size={size} 
              color={color} />
              <Text style={{color: focused ? '#8B19FF' : 'gray', fontSize: 11}}>DASHBOARD</Text>
            </View>
          )
        }}/>

        <Tab.Screen name="Savings" component={SavingsScreen} 
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <View style={styles.tabIcon}>
              <Fontisto 
              name="wallet" 
              size={size} 
              color={color} />
              <Text style={{color: focused ? '#8B19FF' : 'gray', fontSize: 11}}>SAVINGS</Text>
            </View>
          )
        }}/>
        <Tab.Screen name="Add Bank Account" component={LinkAccountScrceen}
        options={{
          tabBarIcon: ({size}) => (
            <View style={styles.tabIcon}>
              <MaterialCommunityIcons 
              name="bank-plus" 
              size={size} 
              color={"white"} />
            </View>
          ),
          tabBarButton: (props) =>
            
            <CustomAddBudgetButton {...props} />
          
        }} 
        />

        <Tab.Screen name="Transactions" component={ViewTransactions}
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <View style={styles.tabIcon}>
              <FontAwesome5 
              name="money-bill-wave" 
              size={size} 
              color={color} />
              <Text style={{color: focused ? '#8B19FF' : 'gray', fontSize: 11}}>TRANSACTIONS</Text>
            </View>
          )
        }}/>

        <Tab.Screen name="Logout" component={SignOutScreen} 
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <View style={styles.tabIcon}>
              <MaterialIcons 
              name="logout" 
              size={size} 
              color={color} />
              <Text style={{color: focused ? '#8B19FF' : 'gray', fontSize: 11}}>LOGOUT</Text>
            </View>
          )
        }}/>

      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  menubar: {
    position: 'absolute',

  },

  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {

      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,

  },


})