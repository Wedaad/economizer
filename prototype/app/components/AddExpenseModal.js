import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function AddExpenseModal({isVisible, closeModal}) {
    const addExpense = () => {

        console.log("Add Expense 2! button pressed");
    }

    return (

        <Modal isVisible={isVisible}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add Expense</Text>
                        <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={closeModal}/>
                    </View>

                    <View style={styles.addBudgetForm}>
                        <View style={styles.addBudgetBtn}>
                            <Button title='Add Expense' onPress={addExpense}/>
                        </View>
                    </View>
                           
                </View>
            </Modal>

    )
}

const styles = StyleSheet.create({

    modalViewStyle: {
        // flex: 0.7,
        height: 450,
        backgroundColor: 'white',
        borderRadius: 15,
        // position: 'absolute',
        // borderWidth: 3,
        // borderColor: 'brown',

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 3,
        // borderColor: 'yellow',

    },

    modalTitle: {
        marginLeft: 15, 
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 25,
    },

    closeIcon: {
        margin: 15,
    },

    addBudgetForm: {
        // borderWidth: 5,
        // borderColor: 'navy',
        padding: 20,

    },
    
    labels: {

        fontSize: 15,
        margin: 10,
    },

    textInput: {

        // marginLeft: 15,
        height: 50,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
    },

});