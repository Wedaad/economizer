import React, {useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function CategoryList({closeModal, setCategoryChosen, transactionId}) {

    const categoryList = [
        {
            id: 1,
            name: 'Entertainment',
            icon: require('../assets/icons/party-emoji.png'),

        },

        {
            id: 2,
            name: 'Groceries',
            icon: require('../assets/icons/groceries.png'),

        },

        {
            id: 3,
            name: 'Shopping',
            icon: require('../assets/icons/shopping.png'),

        },

        {
            id: 4,
            name: 'Restaurants & Food',
            icon: require('../assets/icons/restaurant.png'),

        },

        {
            id: 5,
            name: 'Travel & Holidays',
            icon: require('../assets/icons/plane.png'),

        },

        {
            id: 6,
            name: 'Health & Fitness',
            icon: require('../assets/icons/gym.png'),

        },

        {
            id: 7,
            name: 'Utilities & Bills',
            icon: require('../assets/icons/bills.png'),

        },

        {
            id: 8,
            name: 'Rent',
            icon: require('../assets/icons/rent.png'),

        },

        {
            id: 9,
            name: 'Transport',
            icon: require('../assets/icons/transport.png'),

        },

    ]

    // setting the category for the transaction and updating the database
    const selectCategory = (category) => {
        console.log("setting category", category)
        setCategoryChosen(category);
        console.log(transactionId)

        try {
            console.log("In try")
            firestore().collection('Transactions').doc(transactionId)
            .set({transaction_category: category}, {merge: true})
            .then(() => {"Updated transaction document"})
            

        } catch(error) {

            console.log(` Error: Updating document to include category ${category}`, error)
        }
         
        closeModal(false);

    }

    const categoryItem = ({item}) => {
       return (
        <View>
            <TouchableOpacity onPress={() => selectCategory(item.name)}>
                <View style={styles.categoryView}>
                    <Image source={item.icon} style={{width: 50, height: 50, resizeMode: 'contain',}}/>
                    <Text style={styles.categoryLabel}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        </View>

       ) 
    }

  return (
    <SafeAreaView>
        <FlatList
            data={categoryList}
            renderItem= {categoryItem} 
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    categoryView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },

    categoryLabel: {

        fontFamily: "GTWalsheimPro-Regular",
        fontSize: 18,

    },

})