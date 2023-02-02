/*
    Budgets screen.  The user can create new budgets and add expense entries to each budget.
    The user can create categories and allocate an amount to spend from each category.
    (Envelope budgeting method)
*/ 

import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import * as Progress from 'react-native-progress';
 

const BudgetsScreen = () => {

    const getBudgetProgress = (amountSpent: number, amountAllocated: number) => {

        let ratioSpent = amountSpent / amountAllocated;
        // console.log(ratioSpent);

        // if the user has spent less than half of the amount allocated
        if(ratioSpent < 0.5) {

            return 'blue';

        }
        // if the user has spent less than 3/4 than the amount allocated
        else if(ratioSpent < 0.75) {

            return 'orange';
        }
        // if the user has spent more than 3/4 or has gone over budget
        else {

            return 'red';
        }

    }

    const addExpense = () => {


    }

    const viewExpense = () => {


    }

    return (

        <View style={styles.screenLayout}> 
            <Text style={styles.title}>Budgets</Text>
            <Button title="Add Budget"/>
            {/* <Entypo name="add-to-list" size={24} color="black" /> */}

            {/* VIEW THAT HOLDS THE BUDGETS */}
            <View style={styles.budgetCard}>

                <View style={styles.budgetCardItems}>

                <Text style={styles.budgetCardCategoryText}>Groceries</Text>
                <Text style={styles.budgetCardAmountText}>€20/€50</Text>

                </View>
        
                {/* <Text>30 left</Text> */}

                <View style={styles.progressBar}>
                    {/* GET RID OF HARD CODED VALUES */}
                    <Progress.Bar progress={30/50} width={260} unfilledColor={'#eeeeee'} color={getBudgetProgress(30, 50)}/>
                
                </View>
                
                <View style={styles.budgetCardBtns}>
                    <View style={styles.addExpenseBtn}>
                        <Button title='Add Expense'/>
                    </View>
                    
                    <View style={styles.viewExpenseBtn}>
                        <Button title='View Expense'/>
                    </View>

                </View>
            </View>
        </View>

    );

};

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    title: {
        padding: 8, 
        fontSize: 24,
        fontWeight: "bold",
    },

    budgetCard: {

        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 10,
        borderColor: '#eeeeee',
        borderRadius: 7,
        backgroundColor: '#FAFBFF',
        borderWidth: 1,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
    },

    budgetCardItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    budgetCardBtns: {

        // borderColor: 'purple',
        // borderWidth: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },

    budgetCardAmountText: {

        fontSize: 20,

    },

    budgetCardCategoryText: {

        fontSize: 20,
        fontWeight: 'bold',
    },

    addExpenseBtn: {

        // borderColor: 'green',
        // borderWidth: 4,
        marginRight: 10,
        marginBottom: 10,
    },

    viewExpenseBtn: {

        // borderColor: 'pink',
        // borderWidth: 4,
        marginRight: 10,
        marginBottom: 10,
    },
    
    progressBar: {

        // borderColor: 'red',
        // borderWidth: 4,
        marginBottom: 15,
        marginTop: 10,
        

    },



});

export default BudgetsScreen;