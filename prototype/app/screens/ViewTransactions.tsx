import React, { useState } from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
// import firestore from '@react-native-firebase/firestore';

const ViewTransactions = () => {

    const [transactions, setTransactions] = useState();
    const transaction_array: { amount: number; date: string; merchant: string; category: string; transaction_id: string }[] = [];
    const [myTransactions, setMyTransactions] = useState<{amount: Number,
        date: String,
        merchant: String,
        category: String,
        transaction_id: String }[]>([]);

    const getTransactions = (async () => {

        console.log("Awaiting transaction data");

        await fetch("http://192.168.1.15:8085/transactions/get", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {

            let keys = Object.keys(data.Transactions.transactions);

            for(let i = 0; i < keys.length; i++) {

                let transaction_data = {amount: 0,
                date: "",
                merchant: "",
                category: "",
                transaction_id: "" };

                console.log("TRANSACTION AMOUNT " + [i] + ": " + data.Transactions.transactions[i]["amount"]);
                console.log("TRANSACTION DATE " + [i] + ": " + data.Transactions.transactions[i]["date"]);
                console.log("TRANSACTION MERCHANT " + [i] + ": " + data.Transactions.transactions[i]["merchant_name"]);
                console.log("TRANSACTION CATEGORY " + [i] + ": " + data.Transactions.transactions[i]["category"]);
                console.log("TRANSACTION ID " + [i] + ": " + data.Transactions.transactions[i]["transaction_id"]);

                transaction_data["amount"] = data.Transactions.transactions[i]["amount"];
                transaction_data["date"] = data.Transactions.transactions[i]["date"];
                transaction_data["merchant"] = data.Transactions.transactions[i]["merchant_name"];
                transaction_data["category"] =  data.Transactions.transactions[i]["category"];
                transaction_data["transaction_id"] =  data.Transactions.transactions[i]["transaction_id"];
                
                console.log(transaction_data);

                // firestore().collection("Transactions").add(transaction_data)
                // .then(() => console.log("TRANSACTION ADDED CHECK ME OUT !!"))
                // console.log(myTransactions);
                transaction_array.push(transaction_data);
            }
            
            setMyTransactions(transaction_array);
            console.log(transaction_array);
            console.log(transaction_array.length);
            setTransactions(data);
         
        })
        .catch((err) => {console.log("getTrasaction Error: " + err)});
    });

    useEffect(() => {

        if(transactions == null) {
            getTransactions();
            
        }
    }, [transactions, myTransactions])

    


    return(

        <View style={styles.screenLayout}>
            <ScrollView>
                <Text style={styles.title}>Your Transactions:</Text>

                {myTransactions.map(({amount, transaction_id, date, category, merchant}) => {
                    return (

                    <View>
                        
                        <Text style={styles.boldText}>Transaction ID:</Text><Text style={styles.bodyText}> {transaction_id}</Text>

                        <Text style={styles.boldText}>Amount:</Text><Text style={styles.bodyText}> {amount}</Text>
                            
                        <Text style={styles.boldText}>Date: </Text><Text style={styles.bodyText}>{date}</Text>
                            
                        <Text style={styles.boldText}>Merchant: </Text><Text style={styles.bodyText}>{merchant}</Text>
                            
                        <Text style={styles.boldText}>Category:  </Text><Text style={styles.bodyText}>{category}</Text>
                        <Text>----------------------------------------------------------------</Text>
                    </View>

                    );
                })}

            </ScrollView>
        </View>

    );


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

        fontWeight: 'bold',
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