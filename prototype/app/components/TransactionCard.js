import React from 'react'; 
import { Text, StyleSheet, View } from 'react-native';

export default function TransactionCard ({amount, merchant, date}) {

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const transacion_date = new Date(date)
    let day = date.slice(-2,)
    let current_month = months[transacion_date.getMonth()];
    current_month = current_month.slice(0,3);


    if(merchant.startsWith("From")) {

       merchant = merchant.replace("From", "")
    }

    // Flipping the signs of transactions
    if(amount < 0) { // if the amount retrieved is a negative (make it positive)
        amount = amount * -1

    } else { // if the amount retrieved is a positive (make it negative)

        amount = amount * -1
     
    }

    if (amount < 0) {

        return (

            <View style={{borderLeftColor: "red", borderLeftWidth: 3,...styles.transactionCard}}>

            <View style={styles.dateContainer}>
                <View>
                    <Text style={{fontSize: 20, fontFamily: "GTWalsheimPro-Bold"}}>{day}</Text>
                </View>
                <View>
                    <Text>{current_month}</Text>
                </View>
            </View>
            <View style={styles.merchantContainer}>
                <Text style={styles.transactionCardText}>{merchant}</Text>
            </View>
            
            <View style={styles.amountContainer}>
                <Text style={{color: "red",...styles.transactionCardText}}>&euro;{amount}</Text>
            </View>
        </View>


        )
    } else {

        return (
            
            <View style={{borderLeftColor: "#5CD94E", borderLeftWidth: 3,...styles.transactionCard}}>
                <View style={styles.dateContainer}>
                    <View>
                        <Text style={{fontSize: 20,fontFamily: "GTWalsheimPro-Bold"}}>{day}</Text>
                    </View>
                    <View>
                        <Text>{current_month}</Text>
                    </View>
                </View>
                <View style={styles.merchantContainer}>
                    <Text style={styles.transactionCardText}>{merchant}</Text>
                </View>
                
                <View style={styles.amountContainer}>
                    <Text style={{color: "#5CD94E",...styles.transactionCardText}}>&euro;+{amount}</Text>
                </View>
            </View>
    

        )


    }

}

const styles = StyleSheet.create({

    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10, 
        marginBottom: 10,
        backgroundColor: '#fafafa',
    },

    iconContainer: {
        margin: 5,
    },

    dateContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,

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