import React, {useState} from 'react'; 
import { Text, StyleSheet, View } from 'react-native';


export default function BudgetTransactionCard({amount, description}) {

  return (

    <View style={styles.transactionCard}>
        <Text style={{fontFamily: "GTWalsheimPro-Regular", fontSize: 20}}>{description}</Text>
        <Text>&euro;{amount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({

    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10, 
        // marginBottom: 10,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        marginTop: '5%',
        
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
