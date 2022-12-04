import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

const ViewTransactions = () => {

    return(

        <View>
            <Text style={styles.screenLayout}>Your Transactions:</Text>
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