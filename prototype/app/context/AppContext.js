import React, { useContext, useState } from 'react';
import nextId from "react-id-generator";

const AppContext = React.createContext(); // creating the context

export function useAppConext() {

    return useContext(AppContext);
}

export function AppProvider({children}) {

    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);

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
        console.log("Get expenses for budget: " + budgetName)
        console.log("Expenses: " + expenses)
        console.log("Filter: " + expenses.filter(expense => expense.budgetName === budgetName))
        return expenses.filter(expense => expense.budgetName === budgetName);
    }

    return (

        <AppContext.Provider value={{budgets, expenses, addBudget, addExpense,
        getExpenses}}>
            {children}
        </AppContext.Provider>

    )
}