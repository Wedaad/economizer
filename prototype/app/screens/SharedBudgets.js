import React from 'react';
import { Text, View, StyleSheet} from 'react-native';

export default function SharedBudgets() {
  return (

    <View  style={styles.screenLayout}>
        <Text>Shared Budgets</Text>
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
