import React from 'react';
import {StyleSheet, View, Text, Button, TextInput } from 'react-native';

function SignUpScreen({navigation}:any) {

    const onLoginLinkPress = () => {

        console.log("Login link clicked");
        navigation.navigate("Login")
    }

    return (
        /* Holds main screen contents */
        <View style={styles.screenLayout}>
            {/* <KeyboardAwareScrollView> */}
                <View>
                    <Text style={styles.title}>Create Account</Text>
                    <View style={styles.formContainer}>
                    <Text style={styles.labels}>Full Name</Text>
                    <TextInput 
                    style={styles.textInput} 
                    placeholder='Full Name'
                    />

                    <Text style={styles.labels}>Email</Text>
                    <TextInput style={styles.textInput} 
                    placeholder='Email'
                    />

                    <Text style={styles.labels}>Password</Text>
                    <TextInput style={styles.textInput} 
                    secureTextEntry={true}
                    placeholder='Password'
                    />

                    <Text style={styles.labels}>Confirm Password</Text>
                    <TextInput style={styles.textInput} 
                    secureTextEntry={true}
                    placeholder='Confirm Password'
                    />
                </View>

                <View style={styles.signUpBtn}>
                    <Button title="Sign Up" color="#BE7CFF"/>
                </View>

                <Text style={styles.text}>Already have an account? <Text onPress={onLoginLinkPress} style={styles.loginLink}>Login Here</Text></Text>
                </View>
            {/* </KeyboardAwareScrollView>  */}
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

    signUpBtn: {

        width: 120,
        alignSelf: 'flex-end',
        marginBottom: 15,
        marginRight: 20,

    },
    
    loginLink: {
        color: "#BE7CFF",
        fontWeight: "bold",
        fontSize: 14
    },
});


export default SignUpScreen;