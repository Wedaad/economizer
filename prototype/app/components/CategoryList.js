import React, {useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function CategoryList({closeModal, setCategoryChosen, transactionId}) {

    const categoryList = [
        {
            id: 1,
            name: 'Entertainment',
            icon: require('../assets/icons/party-emoji.png'),
            colour: '#EA40DB',

        },

        {
            id: 2,
            name: 'Groceries',
            icon: require('../assets/icons/groceries.png'),
            colour: '#74EB4A',

        },

        {
            id: 3,
            name: 'Shopping',
            icon: require('../assets/icons/shopping.png'),
            colour: '#32FABA',

        },

        {
            id: 4,
            name: 'Restaurants & Food',
            icon: require('../assets/icons/restaurant.png'),
            colour: '#F5E423',

        },

        {
            id: 5,
            name: 'Travel & Holidays',
            icon: require('../assets/icons/plane.png'),
            colour: '#32A3FA',

        },

        {
            id: 6,
            name: 'Health & Fitness',
            icon: require('../assets/icons/gym.png'),
            colour: '#D66D65',
        },

        {
            id: 7,
            name: 'Utilities, Rent & Bills',
            icon: require('../assets/icons/bills.png'),
            colour: '#F5E423',

        },

        {
            id: 8,
            name: 'Presents & Gifts',
            icon: require('../assets/icons/gifts.png'),
            colour: '#D62965',

        },

        {
            id: 9,
            name: 'Transport',
            icon: require('../assets/icons/transport.png'),
            colour: '#E3B4FF',

        },

        {
            id: 10,
            name: 'Uncategorized',
            icon: require('../assets/icons/no-category.png'),
            colour: '#DDDEDE',

        },

    ]

    // setting the category for the transaction and updating the database
    const selectCategory = (category, colour) => {
        console.log("setting category", category, " colour", colour)
        setCategoryChosen({name: category, colour: colour});
        // setCategoryColour(colour);

        console.log("TRANSACTION ID CATEGORY LIST:",transactionId)

        // try {
        //     console.log("In try")
        //     firestore().collection('Transactions').doc(transactionId)
        //     .set({transaction_category: category}, {merge: true})
        //     .then(() => {"Updated transaction document"})
            

        // } catch(error) {

        //     console.log(` Error: Updating document to include category ${category}`, error)
        // }
         
        closeModal(false);

    }

    const categoryItem = ({item}) => {
       return (
        <View>
            <TouchableOpacity onPress={() => selectCategory(item.name, item.colour)}>
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