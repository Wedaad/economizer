/*
    User registration screen. User enters in their details and their information
    is written to the User firestore collection and the Authentication service in Firebase

*/ 

import React, {useState} from 'react';
import {StyleSheet, View, Text, Pressable, TextInput, SafeAreaView, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

function SignUpScreen({navigation}:any) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const screenBackground = require("../assets/LRScreenBackground3.png")

    const onLoginLinkPress = () => {

        navigation.navigate("Login")
    }

    const onSignUpPress = () => {

        if(!email) {

            setIsVisible(true);
            setErrorMsg("Email field must be filled in.");
            return

        }

        if(password !== confirmPassword) {
            setIsVisible(true);
            setErrorMsg("Passwords don't match. Please try again.");
            return
        }

        auth()
        .createUserWithEmailAndPassword(email, password) // create a user with email and password and logs in the user
        .then((userInfo) => {

            const id = userInfo.user.uid;

            const user_data = {

                user_id: id,
                name,
                email,
                username,
            };

            const userCollection = firestore().collection('Users') // Users collection reference
            .doc(id);
            
            userCollection.set(user_data) // adding the user info entered to the Users collection

            .then(() => {
                navigation.navigate("Login"); // change the screen to the login screen once registration is successful 
            })
        })
        .catch((error) => {

            console.log(error.code)

            if(error.code == 'auth/invalid-email') {

                setIsVisible(true);
                setErrorMsg('Invalid email address. Please enter a correct email address.');

            } 
            if(error.code == 'auth/email-already-in-use') {

                setIsVisible(true);
                setErrorMsg('An account already exists with this email address. Please Login.');
            }
            if(error.code == 'auth/weak-password') {

                setIsVisible(true);
                setErrorMsg('Password must be more than 6 characters long.');
            }
        
        });

    }

    return (
        /* Holds main screen contents */
        <SafeAreaView style={styles.screenLayout}>
            <ImageBackground source={screenBackground} style={styles.background}>
                <KeyboardAwareScrollView>
                    <View>
                        <Text style={styles.title}>Create Account</Text>
                        <View style={styles.formContainer}>
                            <Text style={styles.labels}>Full Name</Text>
                                <TextInput 
                                    style={styles.textInput} 
                                    placeholder='Full Name'
                                    onChangeText={(text) => setName(text)} // setting the value of fullname to the fullname entered
                                    value={name}/>

                                <Text style={styles.labels}>Username</Text>
                                <TextInput 
                                style={styles.textInput} 
                                placeholder='Username'
                                onChangeText={(text) => setUsername(text)} // setting the value of username to the username entered
                                value={username}/>

                                <Text style={styles.labels}>Email</Text>
                                <TextInput style={styles.textInput} 
                                placeholder='Email'
                                onChangeText={(text) => setEmail(text)} // setting the value of email to the email entered
                                value={email}/>

                                <Text style={styles.labels}>Password</Text>
                                <TextInput style={styles.textInput} 
                                secureTextEntry={true}
                                placeholder='Password'
                                onChangeText={(text) => setPassword(text)} // setting the value of password to the password entered
                                value={password}/>

                                <Text style={styles.labels}>Confirm Password</Text>
                                <TextInput style={styles.textInput} 
                                secureTextEntry={true}
                                placeholder='Confirm Password'
                                onChangeText={(text) => setConfirmPassword(text)} // setting the value of confirm password to the password entered
                                value={confirmPassword}/>

                                {isVisible && (
                                    <Text style={styles.errorMsg}>{errorMsg}</Text>
                                )}
                            </View>

                            <View style={styles.btn_container}>
                                <Pressable style={styles.signup_button} onPress={onSignUpPress}>
                                    <Text style={styles.signup_button_text}>Sign Up</Text>
                                </Pressable>
                            </View>

                            <Text style={styles.text}>Already have an account? <Text onPress={onLoginLinkPress} style={styles.loginLink}>Login Here</Text></Text>
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: 'white',
    },
    
    background: {
        flex: 1,
    },

    title: {
        marginLeft: 30,
        marginTop: 40, 
        padding: 10,
        fontSize: 30,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    formContainer: {
        margin: 20,
    },

    textInput: {
        alignSelf: 'center',
        height: 50,
        marginBottom: 15,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 40,
        paddingHorizontal: 20,
        width: 330,
    },

    labels: {
        fontSize: 15,
        padding: 10,
        marginLeft: 25,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    text: {
        textAlign: 'center',
        fontFamily: 'GTWalsheimPro-Regular',
    },

    btn_container: {
        width: 300,
        alignSelf: 'center',
        marginBottom: 15,

    },
    
    loginLink: {
        color: "#BE7CFF",
        fontWeight: "bold",
        fontSize: 14
    },
    errorMsg: {

        color: "red",
        fontSize: 10,
        marginLeft: 35,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    signup_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 72,
        borderRadius: 40,
        elevation: 3,
        backgroundColor: '#8B19FF',
        marginTop: 10,
    },

    signup_button_text: {
        fontSize: 16,
        lineHeight: 21,
        fontFamily: 'GTWalsheimPro-Regular',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default SignUpScreen;