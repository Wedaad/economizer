/*
    Budgets screen.  The user can create new budgets and add expense entries to each budget.
    The user can create categories and allocate an amount to spend from each category.
    (Envelope budgeting method)
*/ 

import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Button, TextInput, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import nextId from "react-id-generator";
import Modal from 'react-native-modal';
import BudgetCard from '../components/BudgetCard';
import AddExpenseModal from '../components/AddExpenseModal';
import firestore from '@react-native-firebase/firestore';
 
export default function BudgetsScreen() {
    
    const [isModalVisible, setModalVisible] = useState(false);
    const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
    const [expenseModalBudgetId, setExpenseModalBudgetId] = useState();
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [budgetName, setBudgetName] = useState('');
    const [budgetId, setBudgetId] = useState("");
    const [category, setCategory] = useState('');
    const [amountSpent, setAmountSpent] = useState(0);
    const [amountAllocated, setAmountAllocated] = useState(0);
    let totalSpent = 0;

    // Budget object template
    const new_budget = {

        budgetId: nextId("budget-id-"),
        name: budgetName,
        category: category,
        amountAllocated: amountAllocated

    }

    // expense object template
    const expense = {
        description: '',
        amount: amountSpent,
        budgetId: budgetId

    }

    const toggleExpenseModal = (budgetId) => {

        console.log("Add Expense button for the " + budgetId + " budget has been clicked");
        setExpenseModalVisible(!isExpenseModalVisible);
        setExpenseModalBudgetId(budgetId);
    }

    // ADD ERROR HANDLING
    const addBudget = () => {

        toggleModal(); //closing the modal
        setBudgetId(budgetId);
        const budgetList = [...budgets, new_budget];

        setBudgets(budgetList);

        console.log("Budget added, budgets: ", budgetList);

        //writing the budget data to firebase
        // const budgetCollection = firestore().collection('Budgets');
        // budgetCollection.add({
        //     budgetId: budgetId, 
        //     budgetName: budgetName,
        //     category: category,
        //     amountAllocated: amountAllocated
        // })
        // .then(() => {

        //     console.log("Budget added to firestore!");
        // })

    }

    const closeExpenseModal = () => {

        console.log("Closing expense modal");
        setExpenseModalVisible(!isExpenseModalVisible);
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
    const addExpense = (inputAmount, budgetId) => {

        console.log("The input amount is: " + parseInt(inputAmount));
        console.log("The set amount is " + amountSpent);
        totalSpent = parseInt(inputAmount) + amountSpent;
        setAmountSpent(totalSpent);
        console.log("The total spent amount is " + totalSpent);
        // setExpenses()
        setExpenseModalVisible(!isExpenseModalVisible);
    }

    // const viewBudgetExpenses = (budgetId) => {
    //     return expenses.filter(expense => expense.budgetId === budgetId)

    // }

    return (

        // <View style={styles.screenLayout}> 
            <ScrollView style={styles.screenLayout}>
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
                            <Button title='Create Budget' onPress={addBudget}/>
                        </View>
                    </View>
                           
                </View>
            </Modal>

            {/* Adding budget details to budget card and generating budget card UI  */}
                {

                    budgets.map(({name, category, amountAllocated, budgetId}) => {
                    
                        return (
                            
                    
                            <BudgetCard key={budgetId} budgetName={name} category={category} 
                            amountAllocated={amountAllocated} amountSpent={amountSpent}
                            onAddExpenseClick={() => toggleExpenseModal(name)}/>
                        );
                    })

                }

                <AddExpenseModal isVisible={isExpenseModalVisible} closeModal={() => closeExpenseModal()}
                     onAddExpenseClick={addExpense}/>

            </ScrollView>
        // </View>

    );

};

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: 'white',
        // paddingTop: 20,
        padding: 10,
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