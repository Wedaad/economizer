import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useAppConext } from '../context/AppContext';
import Modal from 'react-native-modal';
import BudgetTransactionCard from './BudgetTransactionCard';
import GroupInvite from './GroupInvite';

export default function BudgetDetails({isVisible, budgetName, allocatedAmount, budgetId, closeModal, amountSpent, filteredExpenses, setBudgetDetailsModalVisible}) {

    const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
    const [deleteBudgetModalVisible, setDeleteBudgetModalVisible] = useState(false);
    const [editBudgetName, setEditBudgetName] = useState('');
    const [editAllocatedAmount, setEditAllocatedAmount] = useState(0);
    const { currentUserID } = useAppConext();
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isGroupBudget, setIsGroupBudget] = useState(false);

    //checking if the budgetId passed is a group budget
    const isGroupBudgetCheck = async (budgetId) => {

        const groupBudgetRef = firestore().collection('JointBudgets').doc(budgetId);
        const groupBudget = await groupBudgetRef.get();

        if(!groupBudget.exists) {

            return
        } else {

            setIsGroupBudget(!isGroupBudget);
        }

    }

    const editBudget = (budgetId) => {

        if(editBudgetName === '' && editAllocatedAmount === 0){ // if the user has not entered a name or amount, then changes are not written to Firestore

            setEditBudgetModalVisible(!editBudgetModalVisible);

        } else {

            setBudgetDetailsModalVisible(false);
            const budgetCollectionRef = firestore().collection('Users').doc(currentUserID)
            .collection('Budgets').doc(budgetId);

            //updating the budget
            budgetCollectionRef.update({
                budgetName: editBudgetName,
                allocatedAmount: editAllocatedAmount
            })
            .then(() => console.log('Budget updated successfully'))

            clearModalInputs();
            setEditBudgetModalVisible(!editBudgetModalVisible);
        }
    }

    // function which deletes a budget and delete the associated transactions
    const removeBudget = (budgetId) => {
        
        setDeleteBudgetModalVisible(!deleteBudgetModalVisible);
        setBudgetDetailsModalVisible(false);

        const budgetCollectionRef = firestore().collection('Users').doc(currentUserID)
        .collection('Budgets').doc(budgetId);

        const budgetExpensesRef = firestore().collection('BudgetExpenses').where('budgetId', '==', budgetId);
        budgetExpensesRef.get()
        .then((expenseSnapshot) => {

            expenseSnapshot.forEach((expense) => {
                expense.ref.delete();
            })
        })

        budgetCollectionRef.delete()
        .then(() => {

            console.log("Budget deleted successfully from firestore");
        })
        .catch((error) => {

            console.log("ERROR: unable to remove budget from firestore: ",error);
        })

    }

    // function that clears the input fields
    const clearModalInputs = () => {

        setEditBudgetName('');
        setIsErrorVisible(false);
        setEditAllocatedAmount(0);
    }

    useEffect(() => {

        isGroupBudgetCheck(budgetId);
    }, []);

    return (
        <>
            <Modal isVisible={isVisible} avoidKeyboard={true} onBackButtonPress={closeModal} style={styles.modalStyle}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <AntDesign name="arrowleft" size={30} color="black" onPress={closeModal} />
                    </View>
                    <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Bold"}}>Budget Details</Text>
                    <Text style={{textAlign: 'center', fontFamily: "GTWalsheimPro-Regular", marginTop: 5, marginBottom: 10}}>Below are details of your budget. You can edit and delete budgets also.</Text>
                    
                    <Image source={require('../assets/icons/budget-icon.png')} style={{width: 350, height: 250, resizeMode: 'contain', alignSelf: 'center'}}/>
                    <View>
                        <Text style={{textAlign: 'center', fontSize: 25, fontFamily: "GTWalsheimPro-Bold"}}>{budgetName}</Text>
                        <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular"}}>&euro;{allocatedAmount}</Text>

                    </View>

                    <View style={styles.buttonViewContainer}>
                        <TouchableOpacity style={styles.editBudgetButton} onPress={() => setEditBudgetModalVisible(!editBudgetModalVisible)}>
                            <Text style={styles.buttonText}>Edit Budget</Text>
                        </TouchableOpacity>

                        <View>
                            <Text> </Text>
                        </View>

                        <TouchableOpacity style={styles.editBudgetButton} onPress={() => setDeleteBudgetModalVisible(!deleteBudgetModalVisible)}>
                            <Text style={styles.buttonText}>Delete Budget</Text>
                        </TouchableOpacity>

                        <View>
                            <Text> </Text>
                        </View>
                        
                        {isGroupBudget && <GroupInvite groupID={budgetId}/>}
                      
                    </View>

                    <View>
                        <Text style={{textAlign: 'center', fontSize: 25, fontFamily: "GTWalsheimPro-Bold"}}>Recent Budget Transactions</Text>
                    
                        {
                            filteredExpenses.map((transaction, i) => {
                                
                                return (
                                    
                                    <View key={i}>
                                        <BudgetTransactionCard amount={transaction.amountSpent} description={transaction.description}/>
                                    </View>

                                )
                                })

                        }
         
                        {
                            filteredExpenses.length === 0 &&
                            <View>
                                <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular", marginTop: 25}}>No recent transactions</Text>
                            </View>

                        }
    
                    </View>
                    {amountSpent > allocatedAmount && (

                        <View style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular", color: 'red'}}>OVER BUDGET</Text>
                            <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular"}}>TOTAL AMOUNT SPENT: &euro;{amountSpent}</Text>
                        </View>

                    )}

                    <View style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
                        <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular"}}>TOTAL AMOUNT SPENT: &euro;{amountSpent}</Text>
                    </View>
                </View>
            </Modal>

            {
            
            deleteBudgetModalVisible && (
                
                <Modal isVisible={deleteBudgetModalVisible} avoidKeyboard={true} onBackButtonPress={() => setDeleteBudgetModalVisible(false)}>
                    <View style={styles.deleteModal}> 

                        <View style={{marginBottom: 10}}>
                            <Ionicons name="ios-close" size={24} color="black" onPress={() => setDeleteBudgetModalVisible(false)}/>
                        </View>

                        <View style={{marginTop: 20}}>
                            <Text style={{textAlign: 'center', fontFamily: "GTWalsheimPro-Regular"}}>Are you sure you would like to delete this budget?</Text>
                        </View>

                        <View style={{marginTop: 50, alignSelf: 'center'}}>
                            <TouchableOpacity style={styles.Button}  onPress={() => removeBudget(budgetId)}>
                               <Text style={styles.buttonText}>Delete Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                )
            }

            {
                editBudgetModalVisible && (

                    <Modal isVisible={editBudgetModalVisible} avoidKeyboard={true}>
                        <View style={styles.editModal}> 
                        
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                                <Text style={{fontSize: 30, fontFamily: "GTWalsheimPro-Regular", margin: 10}}>Edit Budget</Text>
                                <Ionicons name="ios-close" size={24} color="black" onPress={() => {
                                    setEditBudgetModalVisible(false)
                                    clearModalInputs();
                                    }}/>
                            </View>
                    
                            <View>
                                <Text style={styles.labels}>Edit Budget Name</Text>
                                <TextInput style={styles.textInput}
                                onChangeText={(newName) => {
                                   
                                    if(newName === '') { 
                                        setEditBudgetName(budgetName);
                                    }
                                    else {
                                        setEditBudgetName(newName)
                                    }
                                }}
                                value={editBudgetName}
                                />

                                <Text style={styles.labels}>Edit Allocated Amount</Text>
                                <TextInput style={styles.textInput}
                                onChangeText={(newAmount) => {
                                    if(newAmount < allocatedAmount) {
                                        setErrorMsg('Allocated amount cannot be less than the amount previously allocated');
                                        setIsErrorVisible(true);
                                        return

                                    } else if (newAmount === 0) {

                                        newAmount = allocatedAmount;
                                        setEditAllocatedAmount(allocatedAmount);
                                        
                                    } else {

                                        setIsErrorVisible(false);
                                        setEditAllocatedAmount(newAmount);
                                    }
                                }}
                                keyboardType='numeric'
                                value={editAllocatedAmount}
                                />
                            </View>

                            {isErrorVisible && (<Text style={{color: 'red', fontFamily: 'GTWalsheimPro-Regular'}}>Error: {errorMsg}</Text>)}

                            <View style={{marginTop: 20, alignSelf: 'center'}}>
                                <TouchableOpacity style={styles.Button}  onPress={() => editBudget(budgetId)}>
                                    <Text style={styles.buttonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )


            }


        </>
    )
}

// styling for budget details modal screen
const styles = StyleSheet.create({

    screenLayout: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white'
    },

    modalStyle: {
        backgroundColor: 'white',
    },

    modalViewStyle: {
        padding: 15,
        flex: 1,

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    buttonViewContainer: {

        flexDirection: 'row',
        alignSelf: 'center',
        margin: 10

    },

    editBudgetButton: {
        backgroundColor: '#8B19FF',
        padding: 10,
        borderRadius: 15,

    },

    Button: {
        backgroundColor: '#8B19FF',
        padding: 10,
        borderRadius: 15,
    },

    buttonText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 15,
        color: "white",
        justifyContent: 'flex-end',
        padding: 5,
      
    },

    deleteModal: {
        backgroundColor: 'white',
        padding: 15,
        height: 200,
        borderRadius: 20
    },

    editModal: {

        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20
    },

    labels: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    textInput: {

        height: 50,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
    },

  });
