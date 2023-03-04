import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';


export default function SharedBudgets() {

    const onAddGroupBudgetClick = () => {

        console.log("Add group budget pressed")

    }

    return (

        <View style={styles.screenLayout}>
            <Text style={styles.title}>Shared Budgets</Text>

            <View style={styles.addGroupButtonContainer}>
                <TouchableOpacity style={styles.addGroupButton} onPress={onAddGroupBudgetClick}>
                    <Text style={styles.buttonText}>Create Shared Budget</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  screenLayout: {
      padding: 20,
      flex: 1,
      backgroundColor: 'white'
  },

  title: {
      fontFamily: 'GTWalsheimPro-Regular',
      marginTop: 10, 
      fontSize: 25,
      textAlign: "center",
      
  },

  subTitle: {

      margin: 10, 
      fontSize: 17,
      fontFamily: 'GTWalsheimPro-Regular',
      textAlign: "center",

  },

  buttonView: {

      marginTop: 70,
      alignItems: 'center',
  },

  addGroupButtonContainer: {

    marginTop: 40,

  },

  addGroupButton: {

      position: 'absolute',
      padding: 10,
      backgroundColor: '#8B19FF',
      borderRadius: 10,
      alignSelf: 'center'
  },

  buttonText: {
      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 15,
      color: "white",
      justifyContent: 'flex-end',
      padding: 5,
      // borderWidth: 1
    
  },
});
