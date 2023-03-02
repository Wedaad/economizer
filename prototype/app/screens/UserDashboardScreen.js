import React, {useEffect, useState} from 'react';
import{ View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppConext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import firestore from '@react-native-firebase/firestore';
import AddBudgetModal from '../components/AddBudgetModal';
import AddExpenseModal from '../components/AddExpenseModal';

export default function UserDashboardScreen({route}) {

  useEffect(() => {
    getCurrentUserDetails(userID);
    getBudgets();
  }, [])

  const userID = route.params.userID
  const { getCurrentUserDetails, currentUser, getExpenses, addExpense, addBudget } = useAppConext();
  const [isAddBudgetModalVisible, setAddBudgetModalVisible] = useState(false);
  const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
  const [budgets, setBudgets] = useState([]);
  let budgetNames = [];

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const date = new Date()
  let current_month = months[date.getMonth()];
  // console.log("ID (dashboard screen): " + userID);

  const displayAddBudgetModal = () => {
    setAddBudgetModalVisible(!isAddBudgetModalVisible);
    // console.log("touchable opacity has been pressed!");

  
  }

  // creating budgets 
  const createBudget = (budgetName, category, amountAllocated) => {

    // console.log("Create budget from screen");
    // console.log("budgetName: " + budgetName);
    // console.log("category: " + category);
    // console.log("amountAllocated: " + amountAllocated);
    addBudget({budgetName, category, amountAllocated});
    setAddBudgetModalVisible(!isAddBudgetModalVisible);

    // writing the budget to the database
    try {

        const budgetCollectionRef = firestore().collection('Users').doc(userID)
        .collection('Budgets').doc();


        budgetCollectionRef.set({

            allocatedAmount:  amountAllocated,
            category: category,
            budgetId: budgetCollectionRef.id,
            budgetName: budgetName

        })
        .then(() => console.log("Budget added to firestore, with document ID:", budgetCollectionRef.id));

    } catch (error) {

        console.log("Error adding budget to firestore: " + error);
    }
    
  }

  // reading the budgets from the budgets subcollection in firestore
  const getBudgets = async () => {
    await firestore().collection('Users').doc(userID).collection('Budgets').get()
    .then((budgetSnapshot) => {

      // console.log("Total number of budgets stored in firestore: " + budgetSnapshot.size);

      const newData = budgetSnapshot.docs
      .map((budget) => ({

        ...budget.data(), id:budget.id
    
      })) 
      // console.log("New data:", newData)
      setBudgets(newData);
      // console.log("Dashboard budgets:", budgets);
    })
  }
  
  budgets.forEach(budget => {console.log("Pushing to budget names: " + budget.budgetName), budgetNames.push(budget.budgetName)});
  // console.log("All budget Names: " + budgetNames);

  // toggles expense modal and the id of the budget pressed is passed
  const toggleExpenseModal = () => {

    // console.log("Add Expense button for the " + budgetId + " budget has been clicked");
    setExpenseModalVisible(!isExpenseModalVisible);
    // setExpenseModalBudgetId(budgetId);
}

  const submitAddExpense = (amount, budgetName, desc) => {

    console.log("adding expense");
    console.log("Add Expense button for the " + budgetName + " budget has been clicked");
    // console.log("budgetName: " + budgetName);
    // console.log("amount: " + amount);
    // console.log("desc: " + desc);
    addExpense({amount, budgetName, desc});
    setExpenseModalVisible(!isExpenseModalVisible);
}
 
  return (
    
    <ScrollView style={styles.screenLayout}>
        <Text style={styles.text}>Hello {currentUser}!</Text>

        <View style={styles.pieChartView}>
          <Text>Pie chart goes here</Text>
        </View>

        <View style={styles.monthView}>
          <Text style={styles.monthText}>{current_month}</Text>
        </View>

        <View style={styles.budgetCardView}>

          <View style={styles.textContainer}>
            <View>
              <Text style={styles.text}>Your Budgets</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.addBudgetButton} onPress={displayAddBudgetModal}>
                <Text style={styles.subtitle}>Add Budget</Text>
              </TouchableOpacity>
            </View>
          </View>

          { budgets.length == 0 && 
              <View style={styles.emptyBudgetViewContainer}>
                <View style={styles.emptyBudgetView}>
                  <Text style={styles.screenTextStyle}>You haven't created any budgets.</Text>
                  <Text style={styles.screenTextStyle}>Add a budget and get started!</Text>
                </View>
              </View>
            }

          <ScrollView horizontal={true} style={styles.budgetCardSrollView}>

            {/* Displaying the budgets using data from firebase */}

            {
              budgets.map((budget, i) => {

                const amountSpent = getExpenses(budget.budgetName).reduce((total, expense) => parseInt(total) + parseInt(expense.amount), 0)
                // console.log(amountSpent)

                // console.log(budget.budgetName, budget.category, budget.allocatedAmount);
                return (

                  <BudgetCard key={i} budgetName={budget.budgetName} category={budget.category} 
                      amountAllocated={budget.allocatedAmount} amountSpent={amountSpent} />
                );
              })
            }
          </ScrollView>
        </View>

        <AddBudgetModal isVisible={isAddBudgetModalVisible} 
          closeModal={() => {setAddBudgetModalVisible(false)}} 
          onCreateBudgetClick={createBudget}
        />

        <AddExpenseModal isVisible={isExpenseModalVisible} 
          closeModal={() => {setExpenseModalVisible(false)}} onAddExpenseClick={submitAddExpense}
          budgetNames={budgetNames}/>

        <View style={styles.budgetCardView}>
          <View style={styles.textContainer}>
              <View>
                <Text style={styles.text}>Recent Transactions</Text>
              </View>

              <View>
                <TouchableOpacity style={styles.addTransactionButton} onPress={toggleExpenseModal}>
                  <Text style={styles.subtitle}>Add Transaction</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({

    screenLayout: {
        // borderWidth: 4,
        // borderColor: 'orange',
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    textContainer: {
      flexDirection: 'row',
      // justifyContent: 'center'

    },

    subtitle: {
      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 15,
      color: "white",
      justifyContent: 'flex-end',
      padding: 5,
      // borderWidth: 1
    
    },

    addBudgetButton: {

      position: 'absolute',
      left: 115,
      padding: 5,
      backgroundColor: '#8B19FF',
      borderRadius: 10,
    },

    addTransactionButton: {

      position: 'absolute',
      left: 20,
      padding: 5,
      backgroundColor: '#8B19FF',
      borderRadius: 10,
    },

    text: {

      // borderWidth: 1,
      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 25,
    },

    monthView: {

      borderWidth: 3,
      borderColor: 'purple',

    },

    monthText: {
      fontSize: 25,
      fontFamily: 'GTWalsheimPro-Regular',

    },
    budgetCardView: {

      // borderWidth: 3,
      borderRadius: 20,
      backgroundColor: 'white',
      // borderColor: 'yellow',
      height: 300,
      padding: 10,
      marginTop: 20,
      
    },

    budgetCardSrollView: {

      // borderWidth: 3,
      // borderColor: 'green',
      borderRadius: 20,
      padding: 10,
      marginTop: 5,
      
    },

    pieChartView: {

      borderWidth: 3,
      borderColor: 'red',
      
    },

    emptyBudgetViewContainer: {

      alignSelf: 'center',
      position: 'absolute',
      top: 115,
      padding: 20
    }, 

    screenTextStyle: {
      fontFamily: 'GTWalsheimPro-Regular',
      textAlign: 'center',
      fontSize: 17,

    },

});

