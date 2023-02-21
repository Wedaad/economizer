/*
    Budgets screen.  The user can create new budgets and add expense entries to each budget.
    The user can create categories and allocate an amount to spend from each category.
    (Envelope budgeting method)
*/ 

import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Button, TextInput, ScrollView} from 'react-native';
import AddBudgetModal from '../components/AddBudgetModal';
import { useAppConext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import AddExpenseModal from '../components/AddExpenseModal';

 
export default function BudgetScreen() {

    const [isAddBudgetModalVisible, setAddBudgetModalVisible] = useState(false);
    const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
    const [expenseModalBudgetId, setExpenseModalBudgetId] = useState();
    const { addBudget, budgets, addExpense, getExpenses, expenses }   = useAppConext();

    const createBudget = (budgetName, category, amountAllocated) => {

        console.log("Create budget from screen");
        console.log("budgetName: " + budgetName);
        console.log("category: " + category);
        console.log("amountAllocated: " + amountAllocated);
        addBudget({budgetName, category, amountAllocated});
        setAddBudgetModalVisible(!isAddBudgetModalVisible);
    }

    //change to budgetId
    const submitAddExpense = (amount, budgetName, desc) => {

        console.log("adding expense");
        addExpense({budgetName, amount, desc});
    }

    // when the add budget button is pressed
    // shows/hides modal 
    const toggleModal = () => {

        setAddBudgetModalVisible(!isAddBudgetModalVisible);
        if(!isAddBudgetModalVisible){
            
            console.log("The add budget button has been pressed. Showing modal!")
            
        } else {
            
            console.log("The close icon has been pressed. Hiding modal!")

        }

    }

    // toggles expense modal and the id of the budget pressed is passed
    const toggleExpenseModal = (budgetId) => {

        console.log("Add Expense button for the " + budgetId + " budget has been clicked");
        setExpenseModalVisible(!isExpenseModalVisible);
        setExpenseModalBudgetId(budgetId);
    }

    const closeExpenseModal = () => {

        console.log("Closing expense modal");
        setExpenseModalVisible(!isExpenseModalVisible);
    }

    // const getAmountSpent = (total, expense) => {
    //     return total + expense

    // }

    return (

        <View style={styles.screenLayout}>
            <Text>Budgets</Text>
            <Button title="Add Budget" onPress={toggleModal}/>

            <AddBudgetModal
                isVisible={isAddBudgetModalVisible}
                closeModal={toggleModal}
                onCreateBudgetClick={createBudget}
            />

            <AddExpenseModal isVisible={isExpenseModalVisible} closeModal={() => closeExpenseModal()}
                defaultId={expenseModalBudgetId} onAddExpenseClick={submitAddExpense} />

            {
                
                // PRINTING THE BUDGETS
                budgets.map(budget => {

                    console.log(budget);
                })
                
            }

        
            {

                // PRINTING THE EXPENSES
                expenses.map(expense => {
                    
                    console.log(expense);
                    
                })
            }

            {
            
                budgets.map(budget => {
                    
                    const amountSpent = getExpenses(budget.budgetName).reduce((total, expense) => parseInt(total) + parseInt(expense.amount), 0)
                    return (

                        <BudgetCard key={budget.budgetId} budgetId={budget.budgetId} budgetName={budget.budgetName} category={budget.category} 
                                amountAllocated={budget.amountAllocated} amountSpent={amountSpent} 
                                onAddExpenseClick={() => toggleExpenseModal(budget.budgetName)}/>
                    );

                })

            }

        </View>
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