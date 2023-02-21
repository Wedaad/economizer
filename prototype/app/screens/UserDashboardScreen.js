import React from 'react';
import{ View, Text, StyleSheet } from 'react-native';

export default function UserDashboardScreen() {

  return (
    
    <View style={styles.screenLayout}>
        <Text>User Dashboard</Text>
    </View>
  )
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


});

