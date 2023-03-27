import React, { useContext, useEffect, useState } from 'react';
import nextId from "react-id-generator";
import firestore from '@react-native-firebase/firestore';

const AppContext = React.createContext(); // creating the context

export function useAppConext() {

    return useContext(AppContext);
}

export function AppProvider({children}) {

    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [currentUserID, setCurrentUserID] = useState('');
    const [accessToken, setAccessToken] = useState(accessToken);

    // retrieving the access token stored in the database 
    const getAccessToken = async (userID) => {

        const currentUserDocument = await firestore().collection('Users').doc(userID).get();
        const userData = currentUserDocument.data();
        // console.log(userData);
        setAccessToken(userData.access_token) 

    }

    // getting the logged in user details from firestore (User collection)
    const getCurrentUserDetails = async (userID) => {
        
        await firestore().collection('Users').doc(userID).get()
        .then((user) => {
           
            setCurrentUser(user.data().username);
            setCurrentUserID(user.data().user_id);

        })
        .catch((error) => {

            console.log("CONTEXT ERROR:",error);
            return
        })
    }

    // function addBudget({budgetName, category, amountAllocated, budgetType}) {

    //     setBudgets([...budgets, { budgetId: nextId("budget-id-"), budgetName, category, amountAllocated, budgetType}])
  
    // }

    //change to budgetId
    function addExpense({ amount, desc, budgetName }) {

        setExpenses([...expenses, { expenseId: nextId(), amount, desc, budgetName }])
        expenses.forEach(expense => console.log("Expense Context details: " + expense.amount, expense.desc, expense.budgetName));
    }

    function getExpenses(budgetName) {
        // change to budgetId
        return expenses.filter(expense => expense.budgetName === budgetName);
    }

    function deleteBudget({budgetId}) {
        setBudgets(budgets => {
            return budgets.filter(budget => budget.budgetId !== budgetId)
        })

        console.log("Budegts in context after DELETING a budget: ", budgets);

    }

    // getAccessToken(currentUserID);
    // getCurrentUserDetails(currentUserID);

    return (

        // <AppContext.Provider value={{budgets, expenses, currentUser, currentUserID, accessToken, addBudget, addExpense,
        // getExpenses, deleteBudget, getCurrentUserDetails, getAccessToken, setBudgets}}>
        //     {children}
        // </AppContext.Provider>

        <AppContext.Provider value={{budgets, expenses, currentUser, currentUserID, accessToken, addExpense,
            getExpenses, deleteBudget, getCurrentUserDetails, getAccessToken, setBudgets}}>
            {children}
        </AppContext.Provider>

    )
}