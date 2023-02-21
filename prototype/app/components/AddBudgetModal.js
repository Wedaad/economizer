import React, { useState, useRef } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 

export default function AddBudgetModal({isVisible, closeModal, onCreateBudgetClick}) {

    const [budgetName, setBudgetName] = useState('');
    const [category, setCategory] = useState('');
    const [amountAllocated, setAmountAllocated] = useState(0);

    const clearModalInputs = () => {

        setBudgetName('');
        setCategory('');
        setAmountAllocated(0);
    }

    return (
        
        <Modal isVisible={isVisible}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add New Budget</Text>
                        <Ionicons name="close" size={30} color="black" onPress={closeModal} style={styles.closeIcon}/>
                    </View>

                    <View style={styles.addBudgetForm}>
                        <Text style={styles.labels}>Budget Name</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(name) => setBudgetName(name)}
                        value={budgetName}/>

                        <Text style={styles.labels}>Category</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(category) => setCategory(category)}
                        value={category}/>

                        <Text style={styles.labels}>Amount Allocated</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(amount) => setAmountAllocated(amount)}
                        keyboardType='numeric'
                        value={amountAllocated}/>

                        <View style={styles.addBudgetBtn}>
                            <Button title='Create Budget' onPress={() => onCreateBudgetClick(budgetName, category, amountAllocated, clearModalInputs())}/>
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

    addBudgetBtn: {

        margin: 10,
    },

});