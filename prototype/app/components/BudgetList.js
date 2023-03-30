import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAppConext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

export default function BudgetList({isVisible, closeModal, transationAmount, transactionDate, transactionName, setIsModalVisible}) {

    const { currentUserID } = useAppConext();
    const [budgets, setBudgets] = useState([]);
    const [budgetId, setBudgetId] = useState("");
    const [budgetName, setBudgetName] = useState("");
    let total = 0;
    let amountSpent = 0;

    const getBudgets = async () => {

        const budgetsCollectionbRef = firestore().collection('Users').doc(currentUserID).collection('Budgets');
        const groupBudgetsCollectionRef = firestore().collection('JointBudgets');
        const personalBudgets = budgetsCollectionbRef.get();
        const groupBudgets = groupBudgetsCollectionRef.where('budgetMembers', 'array-contains', currentUserID).get();
    
        const [personalBudgetsSnapshot, groupBudgetsSnapshot] = await Promise.all([personalBudgets, groupBudgets]);
    
        const personalBudgetsData = personalBudgetsSnapshot.docs
        const groupBudgetsData = groupBudgetsSnapshot.docs
    
        const budgetData = personalBudgetsData.concat(groupBudgetsData);
    
        return budgetData;
    
    }

    // populates the dropdown list with all the budget names
     let selectOptions = budgets.map((budget) => {
        return {key: budget.budgetId, value: budget.budgetName}
    })

    const addToBudget = async () => {

        setIsModalVisible(false);

        budgets.forEach(budget => {

            if(budget.budgetId === budgetId) {
            
                budget.amountSpent += parseFloat(transationAmount);
                amountSpent = budget.amountSpent;
                budget.totalExpenses += 1
                total = budget.totalExpenses;
             
            }
        })

        const budgetCollectionRef = firestore().collection('Users').doc(currentUserID).collection('Budgets').doc(budgetId);
        const groupBudgetCollectionRef = firestore().collection('JointBudgets').doc(budgetId);
        const budgetDoc = await budgetCollectionRef.get();
        const groupBudgetDoc = await groupBudgetCollectionRef.get();
    
      
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
      
              amountSpent: parseFloat(transationAmount),
              budgetId: budgetId,
              description: transactionName,
              date: transactionDate,
              userId: currentUserID
      
            }, {merge: true})
            .then(() => console.log("Expense added to firestore with document ID:", expenseCollectionRef.id));
              
          } catch (error) {
              console.log("Error updating amount spent to firestore: " + error);
            
          }
      
    
        } 
        
         // writing the amount spent to the Joint Budgets subcollection in firestore
        if (groupBudgetDoc.exists) {
          
          try {
          
      
            groupBudgetCollectionRef.set({
              amountSpent: parseFloat(amountSpent),
              totalExpenses: total
      
            }, {merge: true})
            .then(() => console.log("Amount spent added to firestore"));
      
            const expenseCollectionRef = firestore().collection('BudgetExpenses').doc();
            
            expenseCollectionRef.set({
      
              amountSpent: parseFloat(transationAmount),
              budgetId: budgetId,
              description: transactionName,
              date: transactionDate,
              userId: currentUserID
      
            }, {merge: true})
            .then(() => console.log("Expense added to firestore with document ID:", expenseCollectionRef.id));
              
          } catch (error) {
              console.log("Error adding amount spent to firestore: " + error);
            
          }
          
        }
       
    }

    useEffect(() => {
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
            <Modal isVisible={isVisible}>

                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Pick a budget for this transaction</Text>
                        <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={closeModal} />
                    </View>
                    
                    <View>
                        <Text style={styles.labels}>Select a Budget</Text>
                        <SelectList 
                            setSelected={(value) => {
                                setBudgetName(value); 
                                
                                selectOptions.forEach((option) => {
                                    
                                    if (option.value === value) {
                                        setBudgetId(option.key)
                                    }
                                })
                                
                            }}
                            data={selectOptions} 
                            placeholder={"Select Budget Name"}
                            search={false}
                            fontFamily="GTWalsheimPro-Regular"
                            save="value"
                            />
                    </View>

                    <View style={styles.BtnView}>

                        <TouchableOpacity style={styles.Btn}  onPress={addToBudget}>
                        {/* <TouchableOpacity style={styles.Btn}  onPress={()  => addtoBudgetClick(budgetId, transationAmount, transactionName, transactionDate)}> */}
                            <Text style={styles.BtnText}>Add to Budget</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </>
    )

}

const styles = StyleSheet.create({

    modalViewStyle: {
        height: 500,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },

    modalTitle: {

        fontSize: 25,
        fontFamily: 'GTWalsheimPro-Regular',
       
    },

    closeIcon: {
        margin: 15,
    },

    labels: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    Btn: {

        padding: 10,
        color: 'white',
        backgroundColor: '#8B19FF',
        borderRadius: 10,
    },

    BtnView: {

        alignSelf: 'center', 
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 15,
    },
    
    BtnText: {

        color: 'white',
        fontFamily: 'GTWalsheimPro-Regular',
    },

});

