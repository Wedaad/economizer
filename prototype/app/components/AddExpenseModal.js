import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useAppConext } from '../context/AppContext';
import { SelectList } from 'react-native-dropdown-select-list';

// export default function AddExpenseModal({isVisible, closeModal, defaultId, onAddExpenseClick}) {
export default function AddExpenseModal({isVisible, closeModal, onAddExpenseClick, budgetNames}) {

    console.log("Expense Modal budget names: " + budgetNames)
    const [amount, setAmount] = useState(0);
    const [budgetName, setBudgetName] = useState('');
    const [description, setDescription] = useState('');
    let selectOptions = [];

    budgetNames.forEach(name => {

        selectOptions.push({label: name, value: name})
        
    });
    
    console.log(selectOptions)
    const clearModalInputs = () => {

        console.log("CLEARING EXPENSE MODAL INPUTS!");
        setDescription('');
        setBudgetName('');
        setAmount(0);
    }

    return (

        <Modal isVisible={isVisible}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add Expense</Text>
                        <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={closeModal}/>
                    </View>

                    <View style={styles.addExpenseForm}>

                        <Text style={styles.labels}>Amount Spent</Text>
                        <TextInput style={styles.textInput}
                        value={amount}
                        onChangeText={(amount) => setAmount(amount)}
                        keyboardType='numeric'
                        />

                        <Text style={styles.labels}>Description</Text>
                        <TextInput style={styles.textInput}
                        value={description}
                        onChangeText={(desc) => setDescription(desc)}
                        />

                        <Text style={styles.labels}>Select a Budget</Text>
                        <SelectList 
                            setSelected={(value) => setBudgetName(value)} 
                            data={selectOptions} 
                            placeholder={"Select Budget Name"}
                            // defaultOption={defaultId}
                            search={false}
                            fontFamily="GTWalsheimPro-Regular"
                            save="value"
                        />
                        
                    </View>

                    <View style={styles.addExpenseBtnView}>
                        <TouchableOpacity style={styles.addExpenseBtn}  onPress={() => {onAddExpenseClick(amount, budgetName, description, clearModalInputs())}}>
                            <Text style={styles.addExpenseBtnText}>Add Expense</Text>
                        </TouchableOpacity>
                    </View>
                           
                </View>
            </Modal>

    )
}

const styles = StyleSheet.create({

    modalViewStyle: {
        // flex: 0.7,
        height: 550,
        backgroundColor: 'white',
        borderRadius: 15,
        // position: 'absolute',
        // borderWidth: 3,
        // borderColor: 'brown',

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    modalTitle: {
        marginLeft: 15, 
        fontSize: 25,
        fontFamily: 'GTWalsheimPro-Regular',
        marginTop: 25,
    },

    closeIcon: {
        margin: 15,
    },

    addExpenseForm: {
        padding: 20,

    },

    addExpenseBtn: {

        padding: 10,
        color: 'white',
        backgroundColor: '#8B19FF',
        borderRadius: 10,
    },

    addExpenseBtnView: {

        alignItems: 'center', 
        margin: 20,
    },
    
    addExpenseBtnText: {

        color: 'white',
        fontFamily: 'GTWalsheimPro-Regular',
    },

    labels: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    textInput: {
        
        height: 50,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
    },

    dropdownContainer: {

        backgroundColor: 'white',
        padding: 16
    },

    dropdown: {

        height: 50, 
        borderColor: '#9B9B9B',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8
    },

    iconStyle: {
        width: 20,
        height: 20,
    },
      
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },


});