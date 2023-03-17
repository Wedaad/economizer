import React, {useEffect, useState} from 'react';
import{ View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAppConext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import firestore from '@react-native-firebase/firestore';
import AddBudgetModal from '../components/AddBudgetModal';
import AddExpenseModal from '../components/AddExpenseModal';
import BudgetDetails from '../components/BudgetDetails';
import BudgetTransactionCard from '../components/BudgetTransactionCard';
import { VictoryPie } from 'victory-native';


export default function UserDashboardScreen({route}) {

  const userID = route.params.userID
  const { getCurrentUserDetails, currentUser, getExpenses, addExpense, addBudget, accessToken } = useAppConext();
  const [isAddBudgetModalVisible, setAddBudgetModalVisible] = useState(false);
  const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
  const [isbudgetCardPressed, setIsBudgetCardPressed] = useState(false);
  const [budgetDetailsModalVisible, setBudgetDetailsModalVisible]  = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetExpenses, setBudgetExpenses] = useState([]);
  const [filteredBudgetTransactions, setFilteredBudgetTransactions] = useState([]);

  const [budgetNamePressed, setBudgetNamePressed] = useState('');
  const [budgetAmountAllocatedPressed, setBudgetAmountAllocatedPressed] = useState(0);
  const [budgetAmountSpentPressed, setBudgetAmountSpentPressed] = useState(0);
  const [budgetIDPressed, setBudgetIDPressed] = useState('');

  let amountSpent = 0;
  let total = 0;
  const [totalBudgetExpenses, setTotalBudgetExpenses] = useState(0);
  const [currentAccountBalance, setCurrentAccountBalance] = useState(0);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const date = new Date()
  let current_month = months[date.getMonth()];

  // function which creates budgets and writes the data to Firestore
  const createBudget = (budgetName, category, amountAllocated, budgetType) => {

    addBudget({budgetName, category, amountAllocated, budgetType});
    setAddBudgetModalVisible(!isAddBudgetModalVisible);

    // writing the budget to the database
    try {

        const budgetCollectionRef = firestore().collection('Users').doc(userID)
        .collection('Budgets').doc();


        budgetCollectionRef.set({

            allocatedAmount:  amountAllocated,
            amountSpent: 0,
            category: category,
            budgetId: budgetCollectionRef.id,
            budgetName: budgetName,
            budgetType: budgetType,
            totalExpenses: 0

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
      console.log("Dashboard budgets:", budgets);
    })
  }

  // toggles expense modal and the id of the budget pressed is passed
  const toggleExpenseModal = () => {

    // console.log("Add Expense button for the " + budgetId + " budget has been clicked");
    setExpenseModalVisible(!isExpenseModalVisible);
    // setExpenseModalBudgetId(budgetId);
  }


  const submitAddExpense = (amount, budgetName, desc, budgetId, date) => {

    // let expenseDate = new Date(date);
    // expenseDate = `${expenseDate.getDate()}/${expenseDate.getMonth() + 1}/${expenseDate.getFullYear()}`;

    budgets.forEach(budget => {

      if(budget.budgetId === budgetId) {

        budget.amountSpent += parseInt(amount);
        amountSpent = budget.amountSpent;
        budget.totalExpenses += 1
        total = budget.totalExpenses;
       
      }
    })
  
    // writing the amount spent to the Budgets subcollection in firestore 
    try {
      console.log("inside submitAddExpense");
      const budgetCollectionRef = firestore().collection('Users').doc(userID)
        .collection('Budgets').doc(budgetId);

      budgetCollectionRef.set({
        amountSpent: parseFloat(amountSpent),
        totalExpenses: total

      }, {merge: true})
      .then(() => console.log("Amount spent added to firestore"));

      const expenseCollectionRef = firestore().collection('BudgetExpenses').doc();
      
      expenseCollectionRef.set({

        amountSpent: parseFloat(amount),
        budgetId: budgetId,
        description: desc,
        date: date

      }, {merge: true})
      .then(() => console.log("Expense added to firestore with document ID:", expenseCollectionRef.id));
        
    } catch (error) {
        console.log("Error adding amount spent to firestore: " + error);
      
    }

    addExpense({amount, budgetName, desc});
    setExpenseModalVisible(!isExpenseModalVisible);
  }

  const getBudgetExpenses = async () => {

    // retrieving the 4 most recent transactions from the BudgetExpenses collection
    await firestore().collection('BudgetExpenses').orderBy('date').limit(4).get()
    .then((expenseSnapshot) => {

      // console.log("Total number of budgets stored in firestore: " + expenseSnapshot.size);
      const expenseData = expenseSnapshot.docs
      .map((expense) => ({

        ...expense.data(), id:expense.id
      }))

      setBudgetExpenses(expenseData);
  
    })
    
  }

  // function which retrieves the user's current account balance 
  const getAccountBalance = async () => { 
    console.log("getting account balance from server...");

    await fetch("http://192.168.1.5:8085/accounts/balance/get", {

    method: "POST",
    
    headers: {

      "Content-Type": "application/json",
    },

    body: JSON.stringify({ access_token: accessToken })

    })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Current balance retrieved from server: ", data.Balance.accounts[0]["balances"]["current"]);
      // console.log("Available balance retrieved from server: ", data.Balance.accounts[0]["balances"]["available"]);

      // currentAccountBalance = data.Balance.accounts[0]["balances"]["current"];
      setCurrentAccountBalance(data);
      console.log("Current account balance 2: ", currentAccountBalance);

    })

  }

  
  const getSpecificExpenses = (budgetId) => {

      // retrieving the 4 most recent transactions for a specific budget in Firestore
      firestore().collection('BudgetExpenses').where('budgetId', '==', budgetId).orderBy('date')
      .limit(4).get()
      .then((querySnapshot) => {
        
        const transactions = querySnapshot.docs
        .map((transaction) => ({
          
              description: transaction.data().description,
              amount: transaction.data().amount,
              budgetId: transaction.data().budgetId,
              ...transaction.data(), id:transaction.id
            }))
            
            setFilteredBudgetTransactions(transactions);
            console.log("transactions length", transactions.length);
      })

  }
            
  const onBudgetCardPress = (budgetId, budgetName, amountAllocated, amountSpent) => {
          
    console.log("onBudgetCardPress for: " + budgetName);
    setBudgetNamePressed(budgetName);
    setBudgetAmountAllocatedPressed(amountAllocated);
    setBudgetAmountSpentPressed(amountSpent);
    setBudgetIDPressed(budgetId);
    setIsBudgetCardPressed(!isbudgetCardPressed)
    setBudgetDetailsModalVisible(true);
    getSpecificExpenses(budgetId);
          
  }

  const getChartData = () => {

    let chartData = budgets.map((budget) => {

      return {
        
          category: budget.category,
          expenseCount: budget.totalExpenses,
          amountSpent: budget.amountSpent,
          budgetId: budget.budgetId
        }
        
        
    })

    // filtering out the expenses which have no transactions
    let filteredExpenses = chartData.filter(expense => expense.amountSpent > 0);

    // calculating total amount spent across all expenses
    let totalExpense = filteredExpenses.reduce((total, expense) => total + (expense.amountSpent || 0), 0);

    // calculate percentage and repopulate the chartData
    let finalChartData = filteredExpenses.map((data) => {

      let percentage = (data.amountSpent / totalExpense * 100).toFixed(0);

      return {

        label: `${percentage}%`,
        y: parseInt(data.amountSpent),
        expenseCount: data.expenseCount,
        budgetId: data.budgetId
      }

    })

    return finalChartData;

  }


  const renderPieChart = () => {

    let chartData = getChartData();
    let totalExpenseCount = chartData.reduce((total, data) => total + (data.expenseCount || 0), 0);

      return (
        <>
          <VictoryPie
            data={chartData}
            colorScale={['#EA40DB', '#74EB4A', '#F5E423', '#32FABA', '#32A3FA', '#D66D65', '#F5E423', '#D62965', '#E3B4FF']}
            labels={({datum}) => `${datum.y}`}
            // radius={}
            innerRadius={110}
            style={{
              data: {
                fillOpacity: 0.9, stroke: "black", strokeWidth: 2
              },
              labels: {
                fontSize: 15,fontFamily: "GTWalsheimPro-Regular"
              },
            }}
            labelRadius={150*0.4+100}
            width={390}
            />

            <View style={styles.monthView}>
              <Text style={styles.monthText}>Total Expenses in</Text>
              <Text style={styles.monthText}>{current_month}:</Text>
              <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Bold', fontSize: 40}}>{totalExpenseCount}</Text>

            </View>

            {/* <View>
              <Text>Categories</Text>
            </View> */}
          </>
      )
  }

      
  console.log("ACCESS TOKEN: " + accessToken);
  useEffect(() => {
    getCurrentUserDetails(userID);
    getBudgets();
    getBudgetExpenses();
    // getAccountBalance();
  }, [])
  
  return (
    
    <>

    <ScrollView style={styles.screenLayout}>
        <Text style={styles.text}>Hello {currentUser}!</Text>
        <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Bold', fontSize: 35}}>Spending Overview</Text>

        <View style={styles.pieChartView}>
          {budgets && renderPieChart()}

          { budgets.length == 0 && 
            <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Regular', fontSize:20}}>
            You haven't created any budgets yet.
            Create budgets to see a summary of your spending.
            </Text>
          }
        
        </View>


        <View style={styles.budgetCardView}>

          <View style={styles.textContainer}>
            <View>
              <Text style={styles.text}>Your Budgets</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.addBudgetButton} onPress={() => setAddBudgetModalVisible(!isAddBudgetModalVisible)}>
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
                return (

                    <TouchableOpacity onPress={() => onBudgetCardPress(budget.budgetId, budget.budgetName, budget.allocatedAmount, budget.amountSpent)} activeOpacity={1}>

                      <BudgetCard key={i} budgetName={budget.budgetName} category={budget.category} 
                      amountAllocated={budget.allocatedAmount} amountSpent={budget.amountSpent} 
                      budgetType={budget.budgetType} budgets={budgets}/>
                    </TouchableOpacity>
                );
              })
            }

            {

              isbudgetCardPressed && (
                
                <BudgetDetails isVisible={budgetDetailsModalVisible} budgetName={budgetNamePressed}
                allocatedAmount={budgetAmountAllocatedPressed} budgetId={budgetIDPressed}
                closeModal={() => {setBudgetDetailsModalVisible(!budgetDetailsModalVisible)}} amountSpent={budgetAmountSpentPressed} filteredExpenses={filteredBudgetTransactions}/>
              )
            } 
          </ScrollView>
        </View>

        <AddBudgetModal isVisible={isAddBudgetModalVisible} 
          closeModal={() => {setAddBudgetModalVisible(false)}} 
          onCreateBudgetClick={createBudget}
        />

        <AddExpenseModal isVisible={isExpenseModalVisible} 
          closeModal={() => {setExpenseModalVisible(false)}} onAddExpenseClick={submitAddExpense}
          budgets={budgets}/>

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

            {
              // displaying the 5 recent transactions using data from firebase
              budgetExpenses.map((expense, i) => {

                return (
                  <View>
                    <BudgetTransactionCard key={i} amount={expense.amountSpent} description={expense.description}/>
                  </View>

                )
              })
            }

          {

            budgetExpenses.length == 0 && 
              <View style={styles.emptyBudgetViewContainer}>
                <View style={styles.emptyBudgetView}>
                  <Text style={styles.screenTextStyle}>There are no recent transactions to be displayed.</Text>
                </View>
              </View>
          }
        </View>
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: '#fafafa',
        padding: 20,
    },

    textContainer: {
      // borderWidth: 5,
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

      alignSelf: 'center',
      // borderWidth: 3,
      // borderColor: 'purple',
      position: 'absolute',
      padding: 20,

    },

    monthText: {
      textAlign: 'center',
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
      borderRadius: 20,
      padding: 10,
      marginTop: 5,
      
    },

    pieChartView: {
      
      backgroundColor: 'white',
      borderRadius: 20,
      top: 5,
      alignItems: 'center',
      justifyContent: 'center',
      
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
    shadow: {
      shadowColor: '#7F5DF0',
      shadowOffset: {
  
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3.5,
      elevation: 5,
  
    },

});

