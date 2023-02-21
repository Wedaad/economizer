import React, { useContext, useState } from 'react';

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
    }

    return (

        <AppContext.Provider value={{addBudget}}>
            {children}
        </AppContext.Provider>

    )
}

// export default AppContext;