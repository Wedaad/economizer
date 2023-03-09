/*
    This screen displays the users transaction data from their connected bank account
    a fetch API call is made to the /transactions/get. This screen will retrieve transactions
    every time the app is started
*/ 

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppConext } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';
import firestore from '@react-native-firebase/firestore';

const ViewTransactions = () => {

    const { currentUserID, accessToken, getAccessToken } = useAppConext(); // getting the logged in user's document id from the app context
    getAccessToken(currentUserID);
    console.log("ACCESS TOKEN ON VIEW TRANSACTION SCREEN:", accessToken);
    const [transactions, setTransactions] = useState();
    const transaction_array: { amount: string; date: string; merchant: string; name: string; category: string; transaction_id: string }[] = [];
    const [myTransactions, setMyTransactions] = useState<{amount: String,
        date: String,
        merchant: String,
        name: String,
        category: String,
        transaction_id: String }[]>([]);

    const getTransactions = (async () => {

        console.log("Awaiting transaction data");

        await fetch("http://192.168.1.23:8085/transactions/get", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: accessToken })
        })
        .then((response) => response.json())
        .then((data) => {

            let keys = Object.keys(data.Transactions.transactions);

            for(let i = 0; i < keys.length; i++) {

                let transaction_data = {amount: "",
                date: "",
                merchant: "",
                name: "",
                category: "",
                transaction_id: "" };

                transaction_data["amount"] = data.Transactions.transactions[i]["amount"];
                transaction_data["date"] = data.Transactions.transactions[i]["date"];
                transaction_data["merchant"] = data.Transactions.transactions[i]["merchant_name"];
                transaction_data["name"] = data.Transactions.transactions[i]["name"];
                transaction_data["category"] =  data.Transactions.transactions[i]["category"];
                transaction_data["transaction_id"] =  data.Transactions.transactions[i]["transaction_id"];

                transaction_array.push(transaction_data);
            }

            setMyTransactions(transaction_array);
            setTransactions(data);
         
        })
        .catch((err) => {console.log("getTrasaction Error: " + err)});
    });

    useEffect(() => {
        if(transactions == null) {
            getTransactions();
            
        }

        // writing the transactions to the database
        myTransactions.forEach((transaction) => {

            try {

                const transactionCollectionRef = firestore().collection('Transactions').doc(transaction.transaction_id.toString());
                transactionCollectionRef.set({
                    transaction_id: transaction.transaction_id,
                    amount: transaction.amount,
                    date: transaction.date,
                    merchant: transaction.name,

                })
                // .then(() => console.log("Added transaction to firestore collection"))

            } catch (error) {

                console.log("Error adding transaction to Firestore:", error)

            }

        });
    }, [transactions])

    if(myTransactions.length === 0) { // if there are no transactions 
        {console.log("in if")}

        return (

            <View style={styles.screenLayout}>
            <Text style={styles.title}>Your Transactions:</Text>
            {/* <ActivityIndicator size="large" color="#8B19FF" /> */}
            <Text style={{fontFamily: "GTWalsheimPro-Regular", textAlign: 'center'}}>Retrieving transaction data from your bank account...</Text>
            <View style={{marginTop: 100, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#8B19FF" />
            </View>
        </View>

        );

    } else {

        return(

            // <View style={styles.screenLayout}>
                <ScrollView style={styles.screenLayout}>
                <Text style={styles.title}>Your Transactions:</Text>
                    {/* <View>
                        <TouchableOpacity>
                            <Text>Add Transaction to A Category</Text>
                        </TouchableOpacity>
                    </View> */}
                    {myTransactions.map(({amount, name, transaction_id, date, category, merchant}, i) => {
                        return (
                            <>
                            
                            <TouchableOpacity onPress={(i) =>console.log(`Transaction ${name} card pressed.`)}>
                                <TransactionCard key={i} amount={amount} merchant={name} date={date}/>
                            </TouchableOpacity>
    
                        </>
    
                        );
                    })}
    
                </ScrollView>
            // </View>
    
        );


    }

};

const styles = StyleSheet.create({
    screenLayout: {
        // borderWidth: 4,
        // borderColor: 'orange',
        padding: 20,
        flex: 1,
        backgroundColor: 'white'
    },
    title: {

        fontFamily: 'GTWalsheimPro-Regular',
        textAlign: 'center',
        padding: 10,
        fontSize: 30,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    bodyText: {

        fontSize: 15,
    }
  });

export default ViewTransactions;