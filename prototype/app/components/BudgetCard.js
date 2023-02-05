import React from 'react'; 
import { Text, StyleSheet, View, Button, TextInput } from 'react-native';
import * as Progress from 'react-native-progress';

export default function BudgetCard({budgetName, category, amountSpent, amountAllocated}) {

    const getBudgetProgress = (amountSpent, amountAllocated) => {

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

    return (

        <View style={styles.budgetCard}>

            <View style={styles.budgetCardItems}>

                {/* <Text style={styles.budgetCardCategoryText}>Groceries</Text> */}
                <Text style={styles.budgetCardCategoryText}>{budgetName}</Text>
                <Text style={styles.budgetCardAmountText}>€{amountSpent}/€{amountAllocated}</Text>
                {/* <Text style={styles.budgetCardAmountText}>€10/€50</Text> */}
            </View>
            <Text>{category}</Text>
        
            {/* <Text>30 left</Text> */}

            <View style={styles.progressBar}>
                {/* GET RID OF HARD CODED VALUES */}
                <Progress.Bar progress={10/50} width={260} unfilledColor={'white'} color={getBudgetProgress(10, 50)}/>
                {/* <Progress.Bar progress={amountSpent/amountAllocated} width={260} unfilledColor={'white'} color={getBudgetProgress(amountSpent, amountAllocated)}/> */}
                
            </View>
                
            <View style={styles.budgetCardBtns}>
                <View style={styles.addExpenseBtn}>
                    <Button title='Add Expense'/>
                </View>
                    
                <View style={styles.viewExpenseBtn}>
                    <Button title='View Expenses'/>
                </View>

             </View>
        </View>

    );
}

const styles = StyleSheet.create({

    title: {
        padding: 8, 
        fontSize: 25,
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