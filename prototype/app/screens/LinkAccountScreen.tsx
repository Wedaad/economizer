import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

const LinkAccountScrceen = ({route}: any) => {

    return (

        <View style={styles.screenLayout}>
            <View>
                <Text style={styles.subTitle}>Hi <Text style={styles.subTitle}>{route.params.username}</Text></Text>
                <Text style={styles.title}>Link eConomizer to your bank account</Text>
            </View>

            <Button title="Link Account Now" color="#BE7CFF"/>

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
        // borderWidth: 4,
        // borderColor: 'red',
        margin: 10, 
        fontSize: 22,
        fontWeight: "bold",
    },

    subTitle: {

        margin: 10, 
        fontSize: 22,
        textAlign: "center",

    },

  });
  export default LinkAccountScrceen;