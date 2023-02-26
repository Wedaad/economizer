import React from 'react'; 
import { Text, StyleSheet, View, Button } from 'react-native';
import * as Progress from 'react-native-progress';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

export default function BudgetCard({ budgetName, category, amountSpent, amountAllocated, onAddExpenseClick, onDeleteBudgetClick }) {
// export default function BudgetCard({budgetName, category, amountAllocated}) {

    console.log("card:", amountAllocated, amountSpent)
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
            <View style={styles.budgetCardItems}>
                <Text style={styles.budgetCardCategoryText}>{budgetName}</Text>
            </View>
            
            <Text>{category}</Text>
        

            <Text style={styles.budgetCardAmountText}>€{amountSpent}/€{amountAllocated}</Text>
            <View style={styles.progressBar}>
                <Progress.Bar progress={amountSpent/amountAllocated} width={120} unfilledColor={'white'} color={getBudgetProgress(amountSpent, amountAllocated)}/>
            </View>
                
        </View>

    );
}

const styles = StyleSheet.create({

    title: {
        padding: 8, 
        fontSize: 25,
        fontFamily: 'Rubik-Regular',
    },

    budgetCard: {

        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginTop: 10,
        // borderColor: '#f5f5f5',
        borderRadius: 15,
        backgroundColor: '#fafafa',
        // borderWidth: 1,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        width: 150,
        margin: 10,
        
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
        fontFamily: 'Rubik-Regular',

    },

    budgetCardCategoryText: {

        fontSize: 20,
        fontFamily: 'GTWalsheimPro-Regular',
        // fontFamily: 'Rubik-Medium',
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
        // marginBottom: 15,
        marginTop: 90,
        alignSelf: 'center'
        

    },

});