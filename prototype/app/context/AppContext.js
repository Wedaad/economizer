import React, { useContext, useState } from 'react';
import nextId from "react-id-generator";
import firestore from '@react-native-firebase/firestore';

const AppContext = React.createContext(); // creating the context

export function useAppConext() {

    return useContext(AppContext);
}

export function AppProvider({children}) {

    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [currentUserID, setCurrentUserID] = useState();


    // getting the logged in user details from firestore (User collection)
    const getCurrentUserDetails = async (userID) => {
        console.log("context userid: " + userID);
        await firestore().collection('Users').doc(userID).get()
        .then((user) => {
            // console.log(user);
            setCurrentUser(user._data.username);
            setCurrentUserID(user._data.user_id);
            console.log("Current User: " + currentUser);
            console.log("CurrentUserID: " + currentUserID);
        })
    }

    function addBudget({budgetName, category, amountAllocated}) {

        console.log("Adding budget from context :)");
        console.log("Context budgetName: " + budgetName);
        console.log("Context category: " + category);
        console.log("Context amountAllocated: " + amountAllocated);

        setBudgets([...budgets, { budgetId: nextId("budget-id-"), budgetName, category, amountAllocated}])
    }

    //change to budgetId
    function addExpense({ budgetName, amount, desc }) {

        console.log("Adding expense from context :)");
        console.log("Context budgetId: " + budgetName);
        console.log("Context amount: " + amount);
        console.log("Context desc: " + desc);

        setExpenses([...expenses, { expenseId: nextId(), amount, desc, budgetName }])
    }

    function getExpenses(budgetName) {
        // change to budgetId
        return expenses.filter(expense => expense.budgetName === budgetName);
    }

    function deleteBudget({budgetId}) {

        console.log("ID in context: " + budgetId)
        setBudgets(budgets => {
            return budgets.filter(budget => budget.budgetId !== budgetId)
        })

    }

    return (

        <AppContext.Provider value={{budgets, expenses, currentUser, currentUserID, addBudget, addExpense,
        getExpenses, deleteBudget, getCurrentUserDetails}}>
            {children}
        </AppContext.Provider>

    )
}