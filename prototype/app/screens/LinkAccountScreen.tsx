import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { PlaidLink, LinkSuccess, LinkExit } from 'react-native-plaid-link-sdk';

const LinkAccountScrceen = ({navigation, route}: any) => {

    const [linkToken, setLinkToken] = useState("");
    // const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

    const generateLinkToken = useCallback(async () => {
        console.log("Awaiting generating of token");
        await fetch('http://192.168.1.15:8085/link/token/create', {

            method: 'POST',
            headers: {

                "Content-Type": "application/json"
            },

            body: JSON.stringify({ address: "192.168.1.15" })
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Setting token to: " + data);
                setLinkToken(data);
            })
            .catch((err) => {

                console.log("Generating token error: " + err);
            });
        }, [setLinkToken])

            useEffect(() => {

                if (linkToken == "") {
                    console.log("Token = ''");
                    generateLinkToken();
                }
            }, [linkToken]);
    
    return (

        <View style={styles.screenLayout}>
            <View>
                <Text style={styles.subTitle}>Hi <Text style={styles.subTitle}>{route.params.username}</Text></Text>
                <Text style={styles.title}>Link eConomizer to your bank account by presing the button below</Text>
            </View>

            <PlaidLink
                tokenConfig={{ token: linkToken, noLoadingState: false }}
                onSuccess={ async (success: LinkSuccess) => {
                    console.log("Awating exchange of tokens");

                    await fetch("http://192.168.1.15:8085/item/public/exchange", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({ public_token: success.publicToken }),
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                    console.log(success + ": " + success.publicToken);   
                    // navigation.navigate('Success', success); // Switch the trasaction screen
                }}
                onExit={(response: LinkExit) => {
                    console.log(response);
                }}
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