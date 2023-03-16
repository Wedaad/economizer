import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from'react-native';
import { Ionicons, MaterialCommunityIcons, AntDesign   } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useAppConext } from '../context/AppContext';
import Modal from 'react-native-modal';
import BudgetTransactionCard from './BudgetTransactionCard';

export default function BudgetDetails({isVisible, budgetName, allocatedAmount, budgetId, closeModal, amountSpent, filteredExpenses}) {

    const [editBudgetModalVisible, setEditBudgetModalVisible] = useState(false);
    const [deleteBudgetModalVisible, setDeleteBudgetModalVisible] = useState(false);
    const { deleteBudget, currentUserID } = useAppConext();
    console.log(budgetId);

    const editBudget = () => {

        console.log('in editBudget');
    }

    // function which deletes a 
    const removeBudget = (budgetId) => {

        console.log('in deleteBudget for budgetId:', budgetId);
        const budgetCollectionRef = firestore().collection('Users').doc(currentUserID)
        .collection('Budgets').doc(budgetId);

        budgetCollectionRef.delete()
        .then(() => {

            console.log("Budget deleted successfully from firestore");
        })
        .catch((error) => {

            console.log("ERROR: unable to remove budget from firestore: ",error);
        }) 
        deleteBudget({budgetId})
        setDeleteBudgetModalVisible(!deleteBudgetModalVisible);
    }

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
                        <TouchableOpacity style={styles.editBudgetButton} onPress={() => editBudget()}>
                            <Text style={styles.buttonText}>Edit Budget</Text>
                        </TouchableOpacity>

                        <View>
                            <Text> </Text>
                        </View>

                        <TouchableOpacity style={styles.editBudgetButton} onPress={() => setDeleteBudgetModalVisible(!deleteBudgetModalVisible)}>
                            <Text style={styles.buttonText}>Delete Budget</Text>
                        </TouchableOpacity>
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
                            <TouchableOpacity style={styles.deleteBudgetButton}  onPress={() => removeBudget(budgetId)}>
                               <Text style={styles.buttonText}>Delete Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                )
            }
        </>
    )
}


const styles = StyleSheet.create({
    screenLayout: {
        // borderWidth: 4,
        // borderColor: 'orange',
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

    deleteBudgetButton: {
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

  });
