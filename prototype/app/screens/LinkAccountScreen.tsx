import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import { PlaidLink, LinkSuccess, LinkExit } from 'react-native-plaid-link-sdk';

const LinkAccountScrceen = ({route}: any) => {

    return (

        <View style={styles.screenLayout}>
            <View>
                <Text style={styles.subTitle}>Hi <Text style={styles.subTitle}>{route.params.username}</Text></Text>
                <Text style={styles.title}>Link eConomizer to your bank account</Text>
            </View>

            <PlaidLink
                tokenConfig={{ token: '#GENERATED_LINK_TOKEN#', noLoadingState: false }}
                onSuccess={(success: LinkSuccess) => console.log(success)}
                onExit={(exit: LinkExit) => console.log(exit)}
            >
                <Text>Link Account</Text>
                {/* <Button title="Link Account Now" color="#BE7CFF"/> */}
            </PlaidLink>
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