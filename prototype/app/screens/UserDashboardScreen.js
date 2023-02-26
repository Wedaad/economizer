import React, {useEffect, useState} from 'react';
import{ View, Text, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';


export default function UserDashboardScreen({route}) {

  const userID = route.params.userID
  const [currentUser, setCurrentUser] = useState();
  console.log("ID (dashboard screen): " + userID)

  // getting the logged in user details from firestore (User collection)
  const getCurrentUserDetails = async () => {

    await firestore().collection('Users').doc(userID).get()
      .then((user) => {
        // console.log(user);
        setCurrentUser(user._data.username)
        console.log("Current User: " + currentUser)
      })
  }

  useEffect(() => {
    getCurrentUserDetails();
  }, [])
 
  return (
    
    <View style={styles.screenLayout}>
        <Text style={styles.text}>Hello {currentUser}!</Text>

        <View style={styles.pieChartView}>
          <Text>Pie chart goes here</Text>
        </View>

        <View style={styles.monthView}>
          <Text>Current Month goes here</Text>
        </View>

        <View style={styles.budgetCardView}>
          <Text style={styles.text}>Your Budgets</Text>
          <ScrollView horizontal={true} style={styles.budgetCardSrollView}>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
            <Text>Budget...</Text>
          </ScrollView>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({

    screenLayout: {
        borderWidth: 4,
        borderColor: 'orange',
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    text: {

      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 25,
    },

    monthView: {

      borderWidth: 3,
      borderColor: 'purple',

    },

    budgetCardView: {

      borderWidth: 3,
      borderColor: 'yellow',
      height: 300,
      paddingTop: 10,
      marginTop: 20,
      
    },

    budgetCardSrollView: {

      borderWidth: 3,
      borderColor: 'green',
      padding: 10,
      marginTop: 5,
      
    },

    pieChartView: {

      borderWidth: 3,
      borderColor: 'red'

    },

});

