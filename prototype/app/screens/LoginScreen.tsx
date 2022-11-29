import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';


function LoginScreen({navigation}:any) {

    const onSignUpLinkPress = () => {

        navigation.navigate("SignUp");
    }

    return (

        <View style={styles.screenLayout}>
            {/* <KeyboardAwareScrollView> */}
                <Text style={styles.title}>Login</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.labels}>Email</Text>
                    <TextInput style={styles.textInput} 
                    placeholder='Email'/>

                    <Text style={styles.labels}>Password</Text>
                    <TextInput style={styles.textInput}
                    secureTextEntry={true}
                    placeholder='Password'/>
                </View>

                <View style={styles.loginBtn}>
                    <Button title="Login" color="#BE7CFF"/>
                </View>
                <Text style={styles.text}>Don't have an account?<Text style={styles.signUpLink} onPress={onSignUpLinkPress}>Sign-Up Here</Text></Text>
            {/* </KeyboardAwareScrollView> */}
        </View>

    );

}

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        // borderWidth: 4,
        // borderColor: 'orange',
        backgroundColor: 'white',
    },

    title: {

        fontWeight: 'bold',
        marginLeft: 30,
        marginTop: 80, 
        padding: 10,
        fontSize: 25,
    },

    formContainer: {

        margin: 20,
    },

    textInput: {

        alignSelf: 'auto',
        height: 50,
        marginBottom: 15,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10
    },

    labels: {

        fontSize: 15,
        padding: 10,
    },

    text: {

        textAlign: 'center'
    },

    loginBtn: {

        width: 120,
        alignSelf: 'flex-end',
        marginBottom: 15,
        marginRight: 20,

    },
    signUpLink: {
        color: "#BE7CFF",
        fontWeight: "bold",
        fontSize: 14

    },

}); 

export default LoginScreen;