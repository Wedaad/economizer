import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import { PlaidLink, LinkSuccess, LinkExit } from 'react-native-plaid-link-sdk';

const LinkAccountScrceen = ({route}: any) => {

    return (

        <View style={styles.screenLayout}>
            <View>
                <Text style={styles.subTitle}>Hi <Text style={styles.subTitle}>{route.params.username}</Text></Text>
                <Text style={styles.title}>Link eConomizer to your bank account by presing the button below</Text>
            </View>

            <PlaidLink
                tokenConfig={{ token: "link-sandbox-6393e454-76ec-4bf4-b212-b9db2cdcc035", noLoadingState: false }}
                onSuccess={(success: LinkSuccess) => console.log(success)}
                onExit={(exit: LinkExit) => console.log(exit)}
            >
                <Text style={styles.linkAccountText}>Link Account</Text>
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
        marginTop: 50, 
        fontSize: 22,
        textAlign: "center",
        
    },

    subTitle: {

        margin: 10, 
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",

    },

    linkAccountText: {

        marginTop: 100, 
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        borderWidth: 5,
        borderColor: "#BE7CFF",
        backgroundColor: "#BE7CFF",
        color: "white",
        paddingTop: 10,
        padding: 5,
    },

  });
  export default LinkAccountScrceen;