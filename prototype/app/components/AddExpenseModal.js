import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import DatePicker from 'react-native-date-picker'

export default function AddExpenseModal({isVisible, closeModal, onAddExpenseClick, budgets, isErrorVisible, errorMessage}) {

    const [amount, setAmount] = useState(0);
    const [budgetName, setBudgetName] = useState('');
    const [description, setDescription] = useState('');
    const [budgetId, setBudgetId] = useState('');
    const [date, setDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // populates the dropdown list with all the budget names
    let selectOptions = budgets.map((budget) => {
        return {key: budget.budgetId, value: budget.budgetName}
    })

    // clears modal fields when modal is closed
    const clearModalInputs = () => {
        setDescription('');
        setBudgetName('');
        setAmount(0);
    }

    // displays the expense modal
    return (
        <>
            <Modal isVisible={isVisible} avoidKeyboard={true}>
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
                                setSelected={(value) => {
                                    setBudgetName(value); 

                                    selectOptions.forEach((option) => {
                                        
                                        if (option.value === value) {
                                            setBudgetId(option.key)
                                        }
                                    })
                                    
                                }}
                                data={selectOptions} 
                                placeholder={"Select Budget Name"}
                                search={false}
                                fontFamily="GTWalsheimPro-Regular"
                                save="value"
                                />

                                <DatePicker
                                        modal
                                        mode='date'
                                        open={isDatePickerOpen}
                                        date={date}
                                        onConfirm={(date) => {
                                            setIsDatePickerOpen(false)
                                            setDate(date)
                                        }}
                                            onCancel={() => {
                                            setIsDatePickerOpen(false)
                                        }}
                                    />
                            
                        </View>


                        <View style={styles.addExpenseBtnView}>

                            <TouchableOpacity onPress={() => setIsDatePickerOpen(true)} style={{backgroundColor: '#8B19FF', padding: 10, borderRadius: 10,}}>
                                <Text style={{fontFamily:"GTWalsheimPro-Regular", color: 'white'}}>Pick a date for this transaction</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.addExpenseBtn}  onPress={() => {onAddExpenseClick(amount, description, budgetId, date, clearModalInputs())}}>
                                <Text style={styles.addExpenseBtnText}>Add Expense</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            isErrorVisible && (

                                <Text style={{color: 'red', fontFamily: 'GTWalsheimPro-Regular', margin:10, fontSize: 17}}>Error: {errorMessage}</Text>
                            )
                        }
                            
                    </View>
            </Modal>

        </>
    )
}

// styling for expense modal
const styles = StyleSheet.create({

    modalViewStyle: {
        height: 650,
        backgroundColor: 'white',
        borderRadius: 15,

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
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 5,
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

});