import React, {useState} from 'react'; 
import { Text, StyleSheet, View } from 'react-native';

export default function BudgetTransactionCard({amount, description}) {

  return (

    <View style={styles.transactionCard}>
        <Text style={{fontFamily: "GTWalsheimPro-Regular", fontSize: 20}}>{description}</Text>
        <Text style={{fontFamily: "GTWalsheimPro-Regular", fontSize: 20}}>&euro;{amount}</Text>
    </View>
  )
}

// styling for budget transaction card
const styles = StyleSheet.create({

    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10, 
        backgroundColor: '#fafafa',
        marginTop: '5%',
        elevation: 2,
        marginRight: '2%',
        marginLeft: '2%'
        
    },

    iconContainer: {
        margin: 5,

    },

    merchantContainer: {
        justifyContent: 'center',
        width: 200,

    },

    amountContainer: {
        justifyContent: 'center'
    },

    transactionCardText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 18,
        textAlign: 'center',
    },

})
