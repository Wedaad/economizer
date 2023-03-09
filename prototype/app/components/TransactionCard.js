import React, {useState} from 'react'; 
import { Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TransactionCard ({ amount, merchant, date}) {

    // const [iconName, setIconName] = useState('');
    
    // // if the amount of the transaction is less than 0 (an expense)
    // if (amount < 0) {

    //     setIconName("bank-transfer-out")

    // } else { // amount greater than 0 (income)

    //     setIconName("bank-transfer-in")
    // }
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const transacion_date = new Date(date)
    let day = date.slice(-2,)
    let current_month = months[transacion_date.getMonth()];
    current_month = current_month.slice(0,3);


    if(merchant.startsWith("From")) {

       merchant = merchant.replace("From", "")
    }

    // if(merchant.startsWith("To")) {

    //     merchant = merchant.replace("To", "")
    //  }

    // Flipping the signs of transactions
    if(amount < 0) { // if the amount retrieved is a negative (make it positive)
        amount = amount * -1

        // return borderLeftColor: '#8B19FF'

    } else { // if the amount retrieved is a positive (make it negative)

        amount = amount * -1
     
    }

    if (amount < 0) {

        return (

            <View style={{borderLeftColor: "red", borderLeftWidth: 3,...styles.transactionCard}}>
            {/* <View style={styles.iconContainer}> */}
                {/* <MaterialCommunityIcons 
                name={"bank-transfer-in"}
                size={24} 
                color="black"/> */}
            {/* </View> */}
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
        
            // <View style={{borderLeftColor: "#8B19FF", borderLeftWidth: 3,...styles.transactionCard}}>
            <View style={{borderLeftColor: "#5CD94E", borderLeftWidth: 3,...styles.transactionCard}}>
                {/* <View style={styles.iconContainer}> */}
                    {/* <MaterialCommunityIcons 
                    name={"bank-transfer-in"}
                    size={24} 
                    color="black"/> */}
                {/* </View> */}
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
        // borderWidth: 2,

    },

    dateContainer: {
        // borderWidth: 2,
        // borderColor: "limegreen",
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
        // margin: 5,
        // left: 150,
        // alignItems: 'flex-end',
        // borderWidth: 2,
        // borderColor: 'red',
        justifyContent: 'center'
    },

    transactionCardText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 18,
        textAlign: 'center',
    },

})