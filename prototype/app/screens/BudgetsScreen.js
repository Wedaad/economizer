/*
    Budgets screen.  The user can create new budgets and add expense entries to each budget.
    The user can create categories and allocate an amount to spend from each category.
    (Envelope budgeting method)
*/ 

import React, { useState } from 'react';
import { Text, StyleSheet, View, Button, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import nextId from "react-id-generator";
import Modal from 'react-native-modal';
import BudgetCard from '../components/BudgetCard';
 
const BudgetsScreen = () => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [budgetName, setBudgetName] = useState('');
    const [category, setCategory] = useState('');
    const [amountSpent, setAmountSpent] = useState(0);
    const [amountAllocated, setAmountAllocated] = useState(0);

    // ADD ERROR HANDLING
    const addBudget = () => {

        toggleModal(); //closing the modal

        const new_budget = {

            budgetId: nextId("budget-id-"),
            name: budgetName,
            category: category,
            amountAllocated: amountAllocated
    
        }

        const budgetList = [...budgets, new_budget];

        setBudgets(budgetList);

        console.log("Budget added, budgets: ", budgetList);

    }

    // when the add budget button is pressed
    // shows/hides modal 
    const toggleModal = () => {

        setModalVisible(!isModalVisible);
        if(!isModalVisible){
            
            console.log("The add budget button has been pressed. Showing modal!")
            
        } else {
            
            console.log("The close icon has been pressed. Hiding modal!")
            clearModalInputs();
        }

    }

    const clearModalInputs = () => {

        setBudgetName('');
        setCategory('');
        setAmountAllocated(0);
    }

    // manually adding expenses to the budget
    const addExpense = (desc, amount, budgetId) => {
        setExpenses(expenseList => {
            return [...expenseList, {id: nanoid(), desc, amount, budgetId}]
        })
    }

    const viewBudgetExpenses = (budgetId) => {
        return expenses.filter(expense => expense.budgetId === budgetId)

    }

    return (

        <View style={styles.screenLayout}> 
            <Text style={styles.title}>Budgets</Text>

            {/* ADDING BUDGET CODE */}
            <Button title="Add Budget" onPress={toggleModal}/>
            {/* <Entypo name="add-to-list" size={24} color="black" /> */}

            <Modal isVisible={isModalVisible} >
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add New Budget</Text>
                        <Ionicons name="close" size={30} color="black" onPress={toggleModal} style={styles.closeIcon}/>
                    </View>

                    <View style={styles.addBudgetForm}>
                        <Text style={styles.labels}>Budget Name</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(name) => setBudgetName(name)}
                        value={budgetName}/>

                        <Text style={styles.labels}>Amount Allocated</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(amount) => setAmountAllocated(amount)}
                        keyboardType='numeric'
                        value={amountAllocated}/>

                        <Text style={styles.labels}>Category</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(category) => setCategory(category)}
                        value={category}/>

                        <View style={styles.addBudgetBtn}>
                            <Button title='Create Budget' onPress={addBudget}/>
                        </View>
                    </View>
                           
                </View>
            </Modal>

            <BudgetCard/>
            {/* <BudgetCard budgetName={"Test"} category={"Education"} amountSpent={60} amountAllocated={100}/> */}
            {/* <BudgetCard budgetName={budgetName} category={category} amountSpent={amountSpent} amountAllocated={amountAllocated}/> */}

            {/* END OF ADDING BUDGET CODE */}

        </View>

    );

};

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    title: {
        padding: 8, 
        fontSize: 25,
        fontWeight: "bold",
    },

    budgetCard: {

        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 10,
        borderColor: '#eeeeee',
        borderRadius: 7,
        backgroundColor: '#FAFBFF',
        borderWidth: 1,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
    },

    budgetCardItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    budgetCardBtns: {

        // borderColor: 'purple',
        // borderWidth: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },

    budgetCardAmountText: {

        fontSize: 20,

    },

    budgetCardCategoryText: {

        fontSize: 20,
        fontWeight: 'bold',
    },

    addExpenseBtn: {

        // borderColor: 'green',
        // borderWidth: 4,
        marginRight: 10,
        marginBottom: 10,
    },

    viewExpenseBtn: {

        // borderColor: 'pink',
        // borderWidth: 4,
        marginRight: 10,
        marginBottom: 10,
    },
    
    progressBar: {

        // borderColor: 'red',
        // borderWidth: 4,
        marginBottom: 15,
        marginTop: 10,
        

    },

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

export default BudgetsScreen;