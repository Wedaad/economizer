import React, {useEffect, useState} from 'react';
import{ View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import { useAppConext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import firestore from '@react-native-firebase/firestore';
import AddBudgetModal from '../components/AddBudgetModal';
import AddGroupBudgetModal from '../components/AddGroupBudgetModal';
import AddExpenseModal from '../components/AddExpenseModal';
import BudgetDetails from '../components/BudgetDetails';
import BudgetTransactionCard from '../components/BudgetTransactionCard';
import { VictoryPie } from 'victory-native';

export default function UserDashboardScreen({route}) {

  const userID = route.params.userID
  const { getCurrentUserDetails, currentUser, getAccessToken } = useAppConext();
  const [isAddBudgetModalVisible, setAddBudgetModalVisible] = useState(false);
  const [isAddGroupBudgetModalVisible, setAddGroupBudgetModalVisible] = useState(false);
  const [isExpenseModalVisible, setExpenseModalVisible] = useState(false);
  const [isbudgetCardPressed, setIsBudgetCardPressed] = useState(false);
  const [budgetDetailsModalVisible, setBudgetDetailsModalVisible]  = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetExpenses, setBudgetExpenses] = useState([]);
  const [filteredBudgetTransactions, setFilteredBudgetTransactions] = useState([]);
  const [isBudgetOptionModalVisible, setBudgetOptionModalVisible] = useState(false);
  const [budgetNamePressed, setBudgetNamePressed] = useState('');
  const [budgetAmountAllocatedPressed, setBudgetAmountAllocatedPressed] = useState(0);
  const [budgetAmountSpentPressed, setBudgetAmountSpentPressed] = useState(0);
  const [budgetIDPressed, setBudgetIDPressed] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const date = new Date()
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let amountSpent = 0;
  let total = 0;
  let current_month = months[date.getMonth()];

  // function which creates budgets and writes the data to Firestore
  const createBudget = (budgetName, category, amountAllocated, budgetType) => {

    if(budgetName === '' && amountAllocated === 0 && budgetType === '' && category === '') { // if the user doesn't fill out any of the text inputs

      setIsErrorVisible(true);
      setErrorMsg("Please fill in all the fields to create a budget");
      return

    } 
    else if (category === '') { // if the category field is empty
      
      setIsErrorVisible(true);
      setErrorMsg("A category must be selected");
      return

    } 
    else if (budgetName === '') { // if the budget name field is empty
      
      setIsErrorVisible(true);
      setErrorMsg("A budget name must be entered");
      return

    } else if (amountAllocated === 0) { // if the user doesn't allocate an amout to the budget
      
      setIsErrorVisible(true);
      setErrorMsg("An amount must be entered");
      return

    } else if (budgetType === ''){ // if the budget type is empty
 
      setIsErrorVisible(true);
      setErrorMsg("A budget type must be selected");
      return

    } else {
      
      setAddBudgetModalVisible(!isAddBudgetModalVisible);
      setBudgetOptionModalVisible(!isBudgetOptionModalVisible);

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
  }

  // creating a group budget
  const createGroupBudget = (budgetName, category, amountAllocated, budgetType, budgetMembers) => {

    if(budgetName === '' && amountAllocated === 0 && budgetType === '' && category === '') { // if the user doesn't fill out any of the text inputs

      setIsErrorVisible(true);
      setErrorMsg("Please fill in all the fields to create a budget.");
      return

    } 
    else if (category === '') { // if the category field is empty
      
      setIsErrorVisible(true);
      setErrorMsg("A category must be selected.");
      return

    } 
    else if (budgetName === '') { // if the budget name field is empty
      
      setIsErrorVisible(true);
      setErrorMsg("A budget name must be entered.");
      return

    } else if (amountAllocated === 0) { // if the user doesn't allocate an amout to the budget
      
      setIsErrorVisible(true);
      setErrorMsg("An amount must be entered.");
      return

    } else if (budgetType === ''){ // if the budget type is empty

      setIsErrorVisible(true);
      setErrorMsg("A budget type must be selected.");
      return

    } else {
  
    try {

        setAddGroupBudgetModalVisible(!isAddGroupBudgetModalVisible);
        setBudgetOptionModalVisible(!isBudgetOptionModalVisible);
        
        // writing the group budget to the database
        const groupBudgetCollectionRef = firestore().collection('JointBudgets').doc();

        groupBudgetCollectionRef.set({
          
          allocatedAmount:  amountAllocated,
          amountSpent: 0,
          category: category,
          budgetId: groupBudgetCollectionRef.id,
          budgetName: budgetName,
          budgetType: budgetType,
          totalExpenses: 0,
          budgetMembers: budgetMembers,
        
        })
        .then(() => console.log("Group Budget added to firestore, with document ID:", groupBudgetCollectionRef.id));


    } catch (error) {

        console.log("Error adding group budget to firestore: " + error);

      }
    }

  }
    
  // getting the budgets from firestore
  const getBudgets = async () => {

    const budgetsCollectionbRef = firestore().collection('Users').doc(userID).collection('Budgets');
    const groupBudgetsCollectionRef = firestore().collection('JointBudgets');
    const personalBudgets = budgetsCollectionbRef.get();
    const groupBudgets = groupBudgetsCollectionRef.where('budgetMembers', 'array-contains', userID).get();

    const [personalBudgetsSnapshot, groupBudgetsSnapshot] = await Promise.all([personalBudgets, groupBudgets]); // logical OR

    const personalBudgetsData = personalBudgetsSnapshot.docs
    const groupBudgetsData = groupBudgetsSnapshot.docs

    const budgetData = personalBudgetsData.concat(groupBudgetsData);

    return budgetData;

  }

  // adding an expense to the database 
  const submitAddExpense = async (amount, desc, budgetId, date) => {

    budgets.forEach(budget => {

      if(budget.budgetId === budgetId) {

        budget.amountSpent += parseFloat(amount);
        amountSpent = budget.amountSpent;
        budget.totalExpenses += 1
        total = budget.totalExpenses;
       
      }
    })

    const budgetCollectionRef = firestore().collection('Users').doc(userID).collection('Budgets').doc(budgetId);
    const groupBudgetCollectionRef = firestore().collection('JointBudgets').doc(budgetId);
    const budgetDoc = await budgetCollectionRef.get();
    const groupBudgetDoc = await groupBudgetCollectionRef.get();

    if(amount === 0 && desc === '' && budgetId === '') { // if the user doesn't fill out text input fields

      setIsErrorVisible(true);
      setErrorMsg("Please fill in all the fields to add a transaction.");
      return

    } else if (amount === 0) { // if the amount field is empty

      setIsErrorVisible(true);
      setErrorMsg("An amount must be entered.");
      return

    } else if (desc === '') { // if the description field is empty

      setIsErrorVisible(true);
      setErrorMsg("Please add a description for this transaction.");
      return

    } else if (budgetId === '') { // if the budget id field is empty

      setIsErrorVisible(true);
      setErrorMsg("Pick a budget for this transaction to be added to.");
      return

    } else {
      
      // writing the amount spent to the Budgets subcollection in firestore
      if(budgetDoc.exists) {

        try {
        
    
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
            date: date,
            userId: userID
    
          }, {merge: true})
          .then(() => console.log("Expense added to firestore with document ID:", expenseCollectionRef.id));
            
        } catch (error) {
            console.log("Error adding amount spent to firestore: " + error);
          
        }
    
      } 
      
      // checking if the group budget exists
      if (groupBudgetDoc.exists) {
        // writitng the group budget to firestore 
        try {
        
    
          groupBudgetCollectionRef.set({
            amountSpent: parseFloat(amountSpent),
            totalExpenses: total
    
          }, {merge: true})
          .then(() => console.log("Amount spent added to firestore"));
    
          const expenseCollectionRef = firestore().collection('BudgetExpenses').doc();
          
          expenseCollectionRef.set({
    
            amountSpent: parseFloat(amount),
            budgetId: budgetId,
            description: desc,
            date: date,
            userId: userID
    
          }, {merge: true})
          .then(() => console.log("Expense added to firestore with document ID:", expenseCollectionRef.id));
            
        } catch (error) {
            console.log("Error adding amount spent to firestore: " + error);
          
        }

      }

      setExpenseModalVisible(!isExpenseModalVisible);

    }

  }

  // retrieving the 4 most recent transactions from the BudgetExpenses collection
  const getBudgetExpenses = async (userID) => {

    await firestore().collection('BudgetExpenses').where('userId', '==', userID).orderBy('date').limit(4).get()
    .then((expenseSnapshot) => {

      const expenseData = expenseSnapshot.docs
      .map((expense) => ({

        ...expense.data(), id:expense.id
      }))

      setBudgetExpenses(expenseData);
  
    })
    
  }
  
  // retrieving the 4 most recent transactions for a specific budget in Firestore
  const getSpecificExpenses = (budgetId) => {

      firestore().collection('BudgetExpenses').where('budgetId', '==', budgetId).orderBy('date', 'asc')
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
      })

  }
            
  const onBudgetCardPress = (budgetId, budgetName, amountAllocated, amountSpent) => {

    setBudgetDetailsModalVisible(true);
    setBudgetNamePressed(budgetName);
    setBudgetAmountAllocatedPressed(amountAllocated);
    setBudgetAmountSpentPressed(amountSpent);
    setBudgetIDPressed(budgetId);
    setIsBudgetCardPressed(!isbudgetCardPressed)
    getSpecificExpenses(budgetId);
          
  }

  // generating the data for the donught chart
  const getChartData = () => {

    let chartData = budgets.map((budget) => {

      return {
        
          category: budget.category.name,
          expenseCount: budget.totalExpenses,
          amountSpent: budget.amountSpent,
          budgetId: budget.budgetId,
          colour: budget.category.colour
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
        y: parseFloat(data.amountSpent),
        expenseCount: data.expenseCount,
        budgetId: data.budgetId,
        category: data.category,
        colour: data.colour
      }

    })

    return finalChartData;

  }

  const toggleModal = () => {

    setBudgetDetailsModalVisible(false);
  }

  // method which renders the header of the screen
  const renderHeader = () => {

    return (
      <View style={{backgroundColor: '#fafafa', padding: 10}}>  
        <Text style={styles.text}>Hello {currentUser}!</Text>
        <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Bold', fontSize: 35, margin: 10}}>Spending Overview</Text>
      </View>
      
    )
  }

  // method which renders the donut chart
  const renderDonutChart = () => {

    let chartData = getChartData();
    let categories = chartData.map((data) => data.category);
    let totalExpenseCount = chartData.reduce((total, data) => total + (data.expenseCount || 0), 0);
    let colourScales = chartData.map((data) => data.colour);

    if(budgets.length === 0) {
      return (

        <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Regular', fontSize: 20, padding: 20}}>
            You haven't created any budgets yet.
            Create budgets to see a summary of your spending.
        </Text>
      )

    }


    if(budgetExpenses.length === 0) {
      return (

        <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Regular', fontSize: 20, padding: 20}}>
            Add Expenses to your budgets to see a summary of your spending.
        </Text>
      )

    }

    if(categories.length > 5) {

      return (
        <>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <VictoryPie
              data={chartData}
              colorScale={colourScales}
              innerRadius={100}
              style={{
                data: {
                  stroke: "black", strokeWidth: 2,
                },
                labels: {
                  fontSize: 15,fontFamily: "GTWalsheimPro-Regular"
                },
              }}
              labelRadius={120*0.2+90}
              />
              
              <View style={styles.monthView}>
                <Text style={styles.monthText}>Total Expenses in</Text>
                <Text style={styles.monthText}>{current_month}:</Text>
                <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Bold', fontSize: 40}}>{totalExpenseCount}</Text>

              </View>
            </View>
        </>
      )


    }

    return (
        <>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <VictoryPie
              data={chartData}
              colorScale={colourScales}
              labels={({datum}) => `${datum.y}%`}
              innerRadius={100}
              style={{
                data: {
                  stroke: "black", strokeWidth: 2,
                },
                labels: {
                  fontSize: 15,fontFamily: "GTWalsheimPro-Regular"
                },
              }}
              labelRadius={120*0.2+90}
              />
              
              <View style={styles.monthView}>
                <Text style={styles.monthText}>Total Expenses in</Text>
                <Text style={styles.monthText}>{current_month}:</Text>
                <Text style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Bold', fontSize: 40}}>{totalExpenseCount}</Text>

              </View>
            </View>
        </>
    )
  }

  // method that renders budget option modal
  const renderBudgetOptionScreen = () => {

    return (

      <>
          <Modal isVisible={isBudgetOptionModalVisible}>
            <View style={styles.modalViewStyle}>
              <View>
                  <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => setBudgetOptionModalVisible(!isBudgetOptionModalVisible)}/>
              </View>

              <View>
                <Text style={styles.title}>Create a Budget</Text>
              </View>

              <Text style={styles.modalSubtitle}>Start budgeting by yourself or with others!</Text>

            

            <View style={styles.optionView}>
                        <Pressable onPress={() => setAddBudgetModalVisible(!isAddBudgetModalVisible)} style={({pressed}) => [{
                                
                                backgroundColor: pressed ? '#E6C6FF' : 'white',
                                borderRadius: 15,
                            }]}>
                            <View style={styles.optionCard}>
                                <Text style={styles.screenText}>Start a personal Budget</Text>
                                <View style={styles.icon}>
                                    <AntDesign name="right" size={15} color="black"/>
                                </View>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setAddGroupBudgetModalVisible(!isAddBudgetModalVisible)} style={({pressed}) => [{
                            
                            backgroundColor: pressed ? '#E6C6FF' : 'white',
                            borderRadius: 15,
                        }]}>
                            <View style={styles.optionCard}>
                                <Text style={styles.screenText}>Start a budget with friends</Text>
                                <View style={styles.icon}>
                                    <AntDesign name="right" size={15} color="black"/>
                                </View>
                                
                            </View>
                        </Pressable>
              </View>
            </View>
          </Modal>
      </>
    )
  }

  // method which renders the budget card view
  const renderBudgetCardView = () => {
     return (

      <View style={styles.budgetCardView}>

             <View style={styles.textContainer}>
               <View>
                 <Text style={styles.text}>Your Budgets</Text>
               </View>
               <View>
                 <TouchableOpacity style={styles.addBudgetButton} onPress={() => setBudgetOptionModalVisible(!isBudgetOptionModalVisible)}>
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
                
                {/* Displaying the budgets using data from firestore */}
        
                {
                  budgets.map((budget, i) => {
                
                    // const amountSpent = getExpenses(budget.budgetName).reduce((total, expense) => parseInt(total) + parseInt(expense.amount), 0)
                    return (
                        <TouchableOpacity onPress={() => onBudgetCardPress(budget.budgetId, budget.budgetName,
                            budget.allocatedAmount, budget.amountSpent)} activeOpacity={1}>
                          <BudgetCard key={i} budgetName={budget.budgetName} category={budget.category} 
                          amountAllocated={budget.allocatedAmount} amountSpent={budget.amountSpent} 
                          budgetType={budget.budgetType} budgetId={budget.budgetId}/>
                        </TouchableOpacity>
                    );
                  })
                }
              </ScrollView>
          </View>
     )

  }

  // method which renders the recent transactions 
  const renderRecentTransactionsView = () => {

    return (
      <View style={styles.budgetCardView}>
           <View style={styles.textContainer}>
               <View>
                 <Text style={styles.text}>Recent Transactions</Text>
               </View>
               <View>
                 <TouchableOpacity style={styles.addTransactionButton} onPress={() => setExpenseModalVisible(!isExpenseModalVisible)}>
                   <Text style={styles.subtitle}>Add Expense</Text>
                 </TouchableOpacity>
               </View>
             </View>

             {
               // displaying the 4 recent transactions using data from firebase
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
       

    )
  }

  // method that renders the add budget modal
  const renderAddBudgetModal = () => {

    return (
      <>
          <AddBudgetModal isVisible={isAddBudgetModalVisible} 
            closeModal={() => {setAddBudgetModalVisible(false)}} 
            onCreateBudgetClick={createBudget} isErrorVisible={isErrorVisible}
            errorMessage={errorMsg}
          />
      </>
        
    )
  }

  // method which renders the group add budget modal
  const renderAddGroupBudgetModal = () => {

    return (
      <AddGroupBudgetModal isVisible={isAddGroupBudgetModalVisible} 
      closeModal={() => {setAddGroupBudgetModalVisible(false)}}
      onCreateGroupBudgetClick={createGroupBudget}/>

    )
  }

  // method which renders add expense modal 
  const renderAddExpenseModal = () => {

    return (

      <AddExpenseModal isVisible={isExpenseModalVisible} 
          closeModal={() => {setExpenseModalVisible(false)}} onAddExpenseClick={submitAddExpense}
          budgets={budgets} isErrorVisible={isErrorVisible}
          errorMessage={errorMsg}/>
    )
  }

  // method which renders the budget details modal
  const renderBudgetDetailsModal = () => {

    if(isbudgetCardPressed) {

      return (
        <BudgetDetails isVisible={budgetDetailsModalVisible} budgetName={budgetNamePressed}
          allocatedAmount={budgetAmountAllocatedPressed} budgetId={budgetIDPressed}
          closeModal={() => {setBudgetDetailsModalVisible(!budgetDetailsModalVisible)}} amountSpent={budgetAmountSpentPressed} 
          filteredExpenses={filteredBudgetTransactions} setBudgetDetailsModalVisible={toggleModal}
        />


      )
    }
  
  }

  // method which renders the category ledgend
  const renderCategoryLegend = () => {

    let categories = getChartData();
    
    const renderItem = ({item}) => {

      return (
    
        <View style={{display: 'flex', flexDirection: 'row', margin: 5}}>
            <View style={{borderRadius: 5, backgroundColor: `${item.colour}`, padding: 10, height: 10, marginRight: 10}}><Text></Text></View>
            <Text style={{fontFamily: 'GTWalsheimPro-Regular', fontSize: 17}}>{item.category}</Text>
        </View>
      )
    }

    if (budgets.length > 0 && budgetExpenses.length > 0) {

      return (
  
        <View style={styles.categoryListView}>
  
          <FlatList
            data={categories}
            renderItem={renderItem}
            horizontal={true}
          />
  
        </View>
      )


    } 

  }


  // rendering the flat list screen layout
  const renderItem = ({item}) => {

    return (
      
      <View style={{backgroundColor: 'white', borderRadius: 20, margin: 5}}>{item.component}</View>
    )

  }

  const SCREENLAYOUT = [

    {
      component_name: 'Header',
      component: renderHeader(),
    },

    {
      component_name: 'Donut_Chart',
      component: renderDonutChart()
    },

    {
      component_name: 'Category_Legend',
      component: renderCategoryLegend()
    },

    {
      component_name: 'Budget_Options',
      component: renderBudgetOptionScreen(),
    },

    {

      component_name: 'Budget_Card_View',
      component: renderBudgetCardView(),
    },

    { 
      component_name: 'Add_Budget_Modal',
      component: renderAddBudgetModal(),
    },

    { 
      component_name: 'Add_Group_Budget_Modal',
      component: renderAddGroupBudgetModal(),
    },

    {
      component_name: 'Recent_Transactions_View',
      component: renderRecentTransactionsView(),
    },

    {

        component_name: 'Add_Expense_Modal',
        component: renderAddExpenseModal(),
    },

    {
      component_name: 'Budget_Details_Modal',
      component: renderBudgetDetailsModal(),

    },

    {
      component_name: 'blank_space',
      component: <View style={{height: 100, backgroundColor: '#fafafa'}}></View>

    }]
      
  useEffect(() => {

    getAccessToken(userID);
    getCurrentUserDetails(userID);
    getBudgetExpenses(userID);

    getBudgets().then(budgetSnapshot => {

      const budgetData = budgetSnapshot
      const budgets = budgetData.map((budget) => ({
  
        ...budget.data(), id:budget.id,
  
      }));
  
      setBudgets(budgets);
  
    })

  }, [budgets])

  
  return (

    <>
      <FlatList
      data={SCREENLAYOUT}
      renderItem={renderItem}
      keyExtractor={layout => layout.component_name}
      style={styles.screenLayout}/>
    </>

  )
}

// styling for userdashboard screen
const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: '#fafafa',
        padding: 20,
    },

    title: {
      fontFamily: 'GTWalsheimPro-Regular',
      marginTop: 10, 
      fontSize: 25,
      textAlign: "center",
      bottom: 5,
    },

    modalSubtitle: {
      margin: 10, 
      fontSize: 17,
      fontFamily: 'GTWalsheimPro-Regular',
      textAlign: "center",

    },

    textContainer: {
      flexDirection: 'row',

    },

    subtitle: {
      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 15,
      color: "white",
      justifyContent: 'flex-end',
      padding: 5,
    
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
      fontFamily: 'GTWalsheimPro-Regular',
      fontSize: 25,
    },

    monthView: {
      top: 170,
      position: 'absolute',

    },

    monthText: {
      textAlign: 'center',
      fontSize: 25,
      fontFamily: 'GTWalsheimPro-Regular',
    },

    budgetCardView: {
      borderRadius: 20,
      backgroundColor: 'white',
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
      borderWidth: 2,
      borderColor: 'yellow',
      height: 300,
      padding: 10,
      marginTop: 20,
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

    modalViewStyle: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      height: '70%'
  
    },

    iconView: {
      right: 50,
    },
  
    optionView: {
      marginTop: 15,
    },
  
    optionCard: {
      borderWidth: 2, 
      borderColor: '#8B19FF',
      borderRadius: 15,
      padding: 25,
      display: 'flex',
      flexDirection: 'row',
      margin: 5,
      
  
    },
  
    icon: {
      position: 'absolute',
      left: 300,
      bottom: 25,
    },

    categoryListView: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius : 20,
      padding: 20
    }

});

