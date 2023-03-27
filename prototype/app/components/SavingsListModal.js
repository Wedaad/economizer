import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAppConext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

export default function SavingsListModal({isVisible, closeModal, transationAmount, transactionDate, transactionName, setIsModalVisible}) {

    const { currentUserID } = useAppConext();
    const [goals, setGoals] = useState([]);
    const [goalId, setGoalId] = useState("");
    const [goalName, setGoalName] = useState("");
    let total = 0;
    let amountSaved = 0;

    // reading the saving goals from the savings 
    const getSavings = async () => {

    const savingsCollectionRef  = firestore().collection('Savings');
    const isAdmin = savingsCollectionRef.where('userID', '==', currentUserID).get();
    const isMember = savingsCollectionRef.where('goalMembers', 'array-contains', currentUserID).get();

    const [adminQuerySnapshot, memberQuerySnapshot] = await Promise.all([isAdmin, isMember]);

    const adminArrayData = adminQuerySnapshot.docs;
    const memberArrayData = memberQuerySnapshot.docs;

    const userData = adminArrayData.concat(memberArrayData);

    return userData;

}

    // retrieving the saving goals from Firestore
    getSavings().then(goalSnapshot => {

        const goalData = goalSnapshot
        .map((savingGoal) => ({

            ...savingGoal.data(), id:savingGoal.id
        }));

        setGoals(goalData);

    })

    // populates the dropdown list with all the budget names
    let selectOptions = goals.map((goal) => {
        return {key: goal.goalID, value: goal.goalName}
    })

    const addToSavings = async () => {

        setIsModalVisible(false);
        goals.forEach((goal) => {
            if(goal.goalID === goalId) {
                goal.amountSaved += parseFloat(transationAmount);
                amountSaved = goal.amountSaved;
            }
        })

        const savingsCollectionRef = firestore().collection('Savings').doc(goalId)
        const savingsDoc = await savingsCollectionRef.get();

        // writing the amount saved to the Savings collection
        if(savingsDoc.exists) {
            try {

                savingsCollectionRef.set({
                    amountSaved: parseFloat(amountSaved)
                }, {merge: true})
                .then(() => console.log("Amount saved updated in firestore"));

                const transactionsCollectionRef = firestore().collection('Transactions').doc();
                
                // add the transaction to the Transactions collection in firestore
                transactionsCollectionRef.set({

                    amount: parseFloat(transationAmount),
                    date: transactionDate,
                    description: transactionName,
                    userID: currentUserID,
                    goalID: goalId,
                }, {merge: true})
                .then(() => console.log("Transaction added successfully to firstore with document id: " + transactionsCollectionRef.id))

            } catch(error) {

                console.log("Error updating amount saved to firestore: " + error);
            }
        }



    }
    
    return (
        <>
            <Modal isVisible={isVisible}>

                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Pick a saving goal for this transaction</Text>
                        <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={closeModal} />
                    </View>
                    
                    <View>
                        <Text style={styles.labels}>Select a Saving Goal</Text>
                        <SelectList 
                            setSelected={(value) => {
                                setGoalName(value); 
                                
                                selectOptions.forEach((option) => {
                                    
                                    if (option.value === value) {
                                        setGoalId(option.key)
                                    }
                                })
                                
                            }}
                            data={selectOptions} 
                            placeholder={"Select Goal Name"}
                            search={false}
                            fontFamily="GTWalsheimPro-Regular"
                            save="value"
                            />
                    </View>

                    <View style={styles.BtnView}>

                        <TouchableOpacity style={styles.Btn} onPress={addToSavings}>
                        {/* <TouchableOpacity style={styles.Btn}  onPress={()  => addtoBudgetClick(budgetId, transationAmount, transactionName, transactionDate)}> */}
                            <Text style={styles.BtnText}>Add to Saving goal</Text>
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

