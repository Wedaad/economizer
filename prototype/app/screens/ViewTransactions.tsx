/*
    This screen displays the users transaction data from their connected bank account
    a fetch API call is made to the /transactions/get. This screen will retrieve transactions
    every time the app is started
*/ 

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { useAppConext } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';
import { Ionicons, AntDesign   } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import moment from 'moment';
import CategoryList from '../components/CategoryList';
import BudgetList from '../components/BudgetList';
import SavingsListModal from '../components/SavingsListModal';

const ViewTransactions = () => {

    const { accessToken } = useAppConext(); // getting the logged in user's document id from the app context
    const [transactionPressed, setTransactionPressed] = useState(false);
    const [selectedTransactionDate, setSelectedTransactionDate] = useState('');
    const [buttonPressed, setButtonPressed] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedTransactionName, setSelectedTransactionName] = useState('');
    const [selectedTransactionID, setSelectedTransactionID] = useState('');
    const [selectedTransactionAmount, setSelectedTransactionAmount] = useState(0);
    const [isAddtoBudgetModalVisible, setIsAddtoBudgetModalVisible] = useState(false)
    const [isAddtoSavingsModalVisible, setIsAddtoSavingsModalVisible] = useState(false)
    const [selectedTransactionCategory, setSelectedTransactionCategory] = useState('');
    const [currentAccountBalance, setCurrentAccountBalance] = useState(0);
    const [transactions, setTransactions] = useState();
    const transaction_array: { amount: string; date: string; merchant: string; name: string; category: string; transaction_id: string }[] = [];
    const [myTransactions, setMyTransactions] = useState<{amount: String,
        date: String,
        merchant: String,
        name: String,
        category: String,
        transaction_id: String }[]>([]);
    
    // retrieving the transactions from the Plaid API
    const getTransactions = (async () => {

        await fetch("http://192.168.1.4:8085/transactions/get", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: accessToken }) // sending the access token to the API endpoint
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

    // retrieving the current account balance from the Plaid API
    const getAccountBalance = async () => { 
    
        await fetch("http://192.168.1.4:8085/accounts/balance/get", {
    
        method: "POST",
        
        headers: {
    
          "Content-Type": "application/json",
        },
    
        body: JSON.stringify({ access_token: accessToken }) // sending the access token to the API endpoint
    
        })
        .then((response) => response.json())
        .then((data) => {

          setCurrentAccountBalance(data.Balance.accounts[0]["balances"]["current"]);
        })
    
    }

    const toggleModal = () => {

        setIsAddtoBudgetModalVisible(false);
    }

    useEffect(() => {

        if(transactions == null) {
            getTransactions();
            
        }
        getAccountBalance();
    }, [transactions])


    const onTransactionCardPressed = (name: any, amount: number, date: string, id: string) => {

        if(name.startsWith("From")){
            
            setSelectedTransactionName(name.replace("From", ""));
        } else {

            setSelectedTransactionName(name);

        }

        // Flipping the transaction signs
        if(amount < 0) {

            setSelectedTransactionAmount(amount * -1)

        } else {

            setSelectedTransactionAmount(amount * -1)
        }


        setSelectedTransactionDate(moment(date).format('MMMM Do YYYY, h:mm:ss a'));
        setSelectedTransactionID(id)
        setTransactionPressed(!transactionPressed)
    }

    if(!accessToken) {

        return (

            <View style={styles.screenLayout}>
                <Text style={styles.title}>Connect your Bank to eConomizer</Text>
                <Text style={{fontFamily: "GTWalsheimPro-Regular", textAlign: 'center'}}>Connect your bank account in order to see your recent bank transactions</Text>

                <View style={{alignSelf: "center", margin: 100}}>
                    <Image source={require('../assets/icons/no-money.png')} style={{width: 400, height: 400, resizeMode: 'contain', alignSelf: 'center'}}/>
                </View>
            </View> 
        )
    }

    if(myTransactions.length === 0) { // if there are no transactions 

        return (

            <View style={styles.screenLayout}>
            <Text style={styles.title}>Your Bank Transactions:</Text>
            <Text style={{fontFamily: "GTWalsheimPro-Regular", textAlign: 'center'}}>Retrieving transaction data from your bank account...</Text>
            <View style={{marginTop: 100, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#8B19FF" />
            </View>
        </View>

        );

    } else {   

        if(transactionPressed) {

            if(selectedTransactionAmount < 0) { // if it's an outgoing transaction

                return (

                    <ScrollView style={styles.screenLayout}>
                        <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => {
                            setTransactionPressed(!transactionPressed)
                            setButtonPressed(true)
                        }}/>

                        <View style={{alignSelf: "center", marginTop: 25}}>
                            <Image source={require('../assets/icons/money-out.png')} style={{width: 230, height: 230, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                        </View>

                        <View style={{alignSelf: "center"}}>
                            <Text style={{fontFamily: "GTWalsheimPro-Bold", marginTop: 20, fontSize: 35}}>Transaction Details</Text>
                        </View>

                        <View style={{alignSelf: "center"}}>
                            <Text style={{fontFamily: "GTWalsheimPro-Regular", marginTop: 20, fontSize: 20}}>Date: {selectedTransactionDate}</Text>
                        </View>

                        <View style={{marginTop: 50}}>
                            <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Regular"}}>{selectedTransactionName}</Text>
                        </View>
                        <View>
                            <Text style={{textAlign: 'center', fontSize: 50, fontFamily: "GTWalsheimPro-Bold"}}>&euro;{selectedTransactionAmount}</Text>
                        </View>


                            <View style={{flexDirection:'row', alignSelf: 'center', marginTop: 25, justifyContent: 'space-between'}}>

                                <TouchableOpacity style={styles.addCategoryButton} onPress={() => {
                                    setIsAddtoBudgetModalVisible(!isAddtoBudgetModalVisible);
                                    
                                }}>
                                    <Text style={{color: 'white'}}>Add to Budget</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                isAddtoBudgetModalVisible && 
                                    <BudgetList isVisible={isAddtoBudgetModalVisible} closeModal={() => {setIsAddtoBudgetModalVisible(false)}}
                                        transationAmount={selectedTransactionAmount*-1} transactionName={selectedTransactionName} transactionDate={selectedTransactionDate}
                                        setIsModalVisible={toggleModal}
                                    />
                            }
                    
                            <Modal isVisible={categoryModalVisible} avoidKeyboard={true} onBackButtonPress={() => setCategoryModalVisible(false)} style={styles.modalStyle}>
                                <View style={styles.modalViewStyle}>
                                    <View style={styles.modalViewElements}>
                                        <AntDesign name="arrowleft" size={30} color="black" onPress={() => setCategoryModalVisible(false)}/>
                                    </View>
                                    <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Bold"}}>Select a Category</Text>
                                    <Text style={{textAlign: 'center', fontFamily: "GTWalsheimPro-Regular", marginTop: 5, marginBottom: 10}}>Select a category you wish to associate with this transaction</Text>

                                    <View>
                                        <CategoryList closeModal={setCategoryModalVisible} setCategoryChosen={setSelectedTransactionCategory} transactionId={selectedTransactionID}/>
                                    </View>
                                </View>
                            </Modal>
                        <View style={{height: 120, backgroundColor: 'white'}}></View>
                    </ScrollView>
                )

            }

            return ( // if it's an incoming transaction

                <ScrollView style={styles.screenLayout}>
                    <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => {
                        setTransactionPressed(!transactionPressed)
                        setButtonPressed(true)
                    }}/>
                 
                    <View style={{alignSelf: "center", marginTop: 25}}>
                        <Image source={require('../assets/icons/money-in.png')} style={{width: 230, height: 230, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                    </View>

                    <View style={{alignSelf: "center"}}>
                        <Text style={{fontFamily: "GTWalsheimPro-Bold", marginTop: 20, fontSize: 35}}>Transaction Details</Text>
                    </View>

                    <View style={{alignSelf: "center"}}>
                        <Text style={{fontFamily: "GTWalsheimPro-Regular", marginTop: 20, fontSize: 20}}>Date: {selectedTransactionDate}</Text>
                    </View>

                    <View style={{marginTop: 50}}>
                        <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Regular"}}>{selectedTransactionName}</Text>
                    </View>
                    <View>
                        <Text style={{textAlign: 'center', fontSize: 50, fontFamily: "GTWalsheimPro-Bold"}}>+&euro;{selectedTransactionAmount}</Text>
                    </View>

                    <View style={{flexDirection:'row', alignSelf: 'center', marginTop: 25, justifyContent: 'space-between'}}>

                        <TouchableOpacity style={styles.addCategoryButton} onPress={() => {
                            setIsAddtoSavingsModalVisible(!isAddtoSavingsModalVisible)
                            console.log("isAddtoSavingsModalVisible: ", isAddtoSavingsModalVisible)
                            
                        }}>
                            <Text style={{color: 'white'}}>Add to Saving Goal</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        isAddtoSavingsModalVisible && 
                            <SavingsListModal isVisible={isAddtoSavingsModalVisible} closeModal={() => {setIsAddtoSavingsModalVisible(false)}}
                                transationAmount={selectedTransactionAmount} transactionName={selectedTransactionName} transactionDate={selectedTransactionDate}
                                setIsModalVisible={toggleModal}
                            />
                    }
                
                    <Modal isVisible={categoryModalVisible} avoidKeyboard={true} onBackButtonPress={() => setCategoryModalVisible(false)} style={styles.modalStyle}>
                        <View style={styles.modalViewStyle}>
                            <View style={styles.modalViewElements}>
                                <AntDesign name="arrowleft" size={30} color="black" onPress={() => setCategoryModalVisible(false)}/>
                            </View>
                            <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Bold"}}>Select a Category</Text>
                            <Text style={{textAlign: 'center', fontFamily: "GTWalsheimPro-Regular", marginTop: 5, marginBottom: 10}}>Select a category you wish to associate with this transaction</Text>

                            <View>
                                <CategoryList closeModal={setCategoryModalVisible} setCategoryChosen={setSelectedTransactionCategory} transactionId={selectedTransactionID}/>
                            </View>
                        </View>
                    </Modal>
                    <View style={{height: 120, backgroundColor: 'white'}}></View>
                </ScrollView>
            )
        }

        return(

            <ScrollView style={styles.screenLayout}>
                <Text style={styles.title}>Your Bank Transactions:</Text>

                <View>
                    <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular", marginTop: 5, marginBottom: 10}}>Current Account Balance: &euro;{currentAccountBalance}</Text>
                </View>

                    {
                        myTransactions.map(({amount, name, transaction_id, date}, i) => {
                            return (
                                
                                <TouchableOpacity key={i} onPress={() => {
                                    onTransactionCardPressed(name, parseFloat(amount.toString()), date.toString(), transaction_id.toString())
                                }}>
                                    <TransactionCard amount={amount} merchant={name} date={date}/>
                                </TouchableOpacity>
        
        
                            );
                        })
                    }
                    <View style={{height: 120, backgroundColor: 'white'}}></View>
                </ScrollView>    
        );


    }

};

// styling for transaction screen
const styles = StyleSheet.create({
    screenLayout: {
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
    },
    modalStyle: {
        backgroundColor: '#fafafa',
    },

    modalViewStyle: {
        padding: 15,
        flex: 1,

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,

    },
    addCategoryButton: {

        padding: 10,
        backgroundColor: '#8B19FF',
        borderRadius: 10,
        alignSelf: 'center',
    },
  });

export default ViewTransactions;