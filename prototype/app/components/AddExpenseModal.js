import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import { set } from 'react-native-reanimated';

export default function AddExpenseModal({isVisible, closeModal, onAddExpenseClick}) {

    const [amount, setAmount] = useState(0);
    const [budgetID, setBudgetID] = useState('');
    const [budgetCategory, setBudgetCategory] = useState('');

    console.log("Amount: " + amount)
    console.log("Amount: " + budgetID)
    console.log("Amount: " + budgetCategory)

    return (

        <Modal isVisible={isVisible}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add Expense</Text>
                        <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={closeModal}/>
                    </View>

                    <View style={styles.addExpenseForm}>
                        {/* <Text style={styles.labels}>Description Name</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(desc) => context.setDescription(desc)} 
                        /> */}

                        <Text style={styles.labels}>Amount Spent</Text>
                        <TextInput style={styles.textInput}
                        value={amount}
                        onChangeText={(amount) => setAmount(amount)}
                        keyboardType='numeric'
                        />

                        <Text style={styles.labels}>Budget</Text>
                        

                        
                    </View>

                    <View style={styles.addExpenseForm}>
                        <View style={styles.addExpenseBtn}>
                            <Button title='Add Expense' onPress={() => onAddExpenseClick(amount, budgetId)}/>
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

    addExpenseForm: {
        // borderWidth: 5,
        // borderColor: 'navy',
        padding: 20,

    },

    addExpenseBtn: {

        margin: 10,
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