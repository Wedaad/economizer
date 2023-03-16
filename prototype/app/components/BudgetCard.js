import React, {useEffect, useState} from 'react'; 
import { Text, StyleSheet, View, Button, TouchableOpacity } from 'react-native';
import { Bar as ProgressBar } from 'react-native-progress';
import firestore from '@react-native-firebase/firestore';
import { useAppConext } from '../context/AppContext';

export default function BudgetCard({ budgetName, category, amountSpent, amountAllocated, budgetType, budgets }) {
// export default function BudgetCard({budgetName, category, amountAllocated, onDeleteBudgetClick}) {

    let current_date = new Date();
    const { currentUserID } = useAppConext();

    // function which returns true or false if the day of the week is Sunday
    const isSunday = (date = new Date()) => {

        const sunday = new Date(date)
        return sunday.getDay() === 0

    }

    const resetBudgets = (budgetId) => {

        try {

            const budgetCollectionRef = firestore().collection('Users').doc(currentUserID)
            .collection('Budgets').doc(budgetId);

            budgetCollectionRef.update({
                budgetName: budgetName,
                category: category,
                allocatedAmount: amountAllocated,
                amountSpent: 0,
                budgetType: budgetType,
            })
            .then(() => "SUCCESSFULLY UPDATED & RESET THE BUDGET")
            
        } catch (error) {
            console.log("ERROR WHEN RESETTING & UPDATING BUDGET:", error)
        }

    }

    useEffect (() => {
        budgets.forEach(budget => {

            if(budget.budgetType === 'weekly' && isSunday(current_date)) {
                resetBudgets(budget.budgetId);
                
            }
        })

    }, [budgets])
    

    const getBudgetProgress = (amountSpent, amountAllocated) => {

        let ratioSpent = amountSpent / amountAllocated;

        // if the user has spent less than half of the amount allocated
        if(ratioSpent < 0.5) {

            return '#8B19FF';

        }
        // if the user has spent less than 3/4 than the amount allocated
        else if(ratioSpent < 0.75) {

            return '#8B19FF';
        }
        // if the user has spent more than 3/4 or has gone over budget
        else {
            
            return 'red';
        }

    } 

    return (

        <View style={[styles.budgetCard, styles.shadow]}>
            <Text style={{color: '#8B19FF', marginBottom: 5}}>Category: {category}</Text>

            <View style={styles.budgetCardItems}>
                <Text style={styles.budgetCardCategoryText}>{budgetName}</Text>
            </View>
                

            <Text style={styles.budgetCardAmountText}>&euro;{amountSpent}/&euro;{amountAllocated}</Text>
            <View style={styles.progressBar}>
                <ProgressBar progress={amountSpent/amountAllocated} width={120} unfilledColor={'white'} color={getBudgetProgress(amountSpent, amountAllocated)}/>
            </View>
                
        </View>
       

    );
}

const styles = StyleSheet.create({

    budgetCard: {

        height: '95%',
        borderRadius: 15,
        backgroundColor: '#fafafa',
        // borderWidth: 2,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        width: 170,
        margin: 10,
        elevation: 3,
        
    },

    budgetCardItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    shadow: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    budgetCardAmountText: {

        fontSize: 20,
        fontFamily: 'GTWalsheimPro-Regular',

    },

    budgetCardCategoryText: {

        fontSize: 20,
        fontFamily: 'GTWalsheimPro-Regular',

    },

    progressBar: {

        position: 'absolute',
        bottom: 20,
        alignSelf: 'center'

    },

});