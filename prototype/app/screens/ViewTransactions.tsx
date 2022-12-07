import React, { useState } from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const ViewTransactions = ({route}: any) => {

    const [transactions, setTransactions] = useState(null);

    const getTransactions = (async () => {

        console.log("Awaiting transaction data");

        await fetch('http://192.168.1.15:8085/transactions/get', {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {

            setTransactions(data);
        })
        .catch((err) => { console.log("getTrasaction Error: " + err)});
    });

    useEffect(() => {

        if(transactions == null) {
            getTransactions();
            
        }
    }, [transactions])

    return(

        <View style={styles.screenLayout}>
            <Text>Your Transactions:</Text>

            <View>
                <Text>

                    {
                        JSON.stringify(transactions)

                    }
                </Text>

            </View>
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

  });

export default ViewTransactions;