import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';


export default function SavingCard({goalName, goalAmount, type}) {

    // if(type === 'personal') {
    //     return (

    //         <View style={styles.savingCard}>
    //             <Ionicons name="ios-person" size={30} color="black" />
    //             <View style={styles.savingCardItems}>
    //                 <Text style={styles.goalNameText}>{goalName}</Text>
    //             </View>
    //             <View>
    //                 <Text style={styles.goalAmountText}>Target: {goalAmount}</Text>
    //             </View>
    //         </View>

    //     )
    // } else {


        return (
            <View style={styles.savingCard}>
                <MaterialCommunityIcons name="account-group" size={30} color={"black"} />
                <View style={styles.savingCardItems}>
                    <Text style={styles.goalNameText}>{goalName}</Text>
                </View>
                <View>
                    <Text style={styles.goalAmountText}>Target: {goalAmount}</Text>
                </View>
            </View>
        )
    // }

}

const styles = StyleSheet.create({

    savingCard: {
        borderRadius: 15,
        backgroundColor: '#fafafa',
        padding: 20,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#8B19FF',
        width: 170,
        height: 200,
        margin: 5,
        elevation: 2,
    },

    savingCardItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 2,
        // borderColor: 'green',

    },

    goalNameText: {

        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 20,
    },

    goalAmountText: {

        fontFamily: 'GTWalsheimPro-Regular',
    }

})