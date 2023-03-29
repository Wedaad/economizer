/*
    User Login screen. If the details entered are the same as the details stored 
    in Firebase's Auth service then the user will login successfully
*/ 
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

function LoginScreen({navigation}:any) {
    
    const screenBackground = require("../assets/LRScreenBackground3.png")
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const onSignUpLinkPress = () => {

        navigation.navigate("SignUp");
    }

    const onLoginPress = () => {

        if(!email) { // if no email is entered

            setIsVisible(true);
            setErrorMsg("Email field must be filled in.");
            return
        }

        if (!password) { // if no password is entered

            setIsVisible(true);
            setErrorMsg("Password must be filled.");
            return
        }


        auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {

            const user = response.user.uid
        })
        .catch(error => { // displaying error messages for various errors

            if(error.code == 'auth/invalid-email') { // if the email is invalid

                setIsVisible(true);
                setErrorMsg('Invalid email address. Please enter a correct email address.');

            } 

            if(error.code == 'auth/wrong-password') { // if the password is invalid

                setIsVisible(true);
                setErrorMsg('Incorrect password.');
            }

            if(error.code == 'auth/user-not-found') { // if the user doesn't exist

                setIsVisible(true);
                setErrorMsg('User not Found. Create an account to login.');

            }

        })

    }

    return (
        <SafeAreaView style={styles.screenLayout}>
            <ImageBackground source={screenBackground} style={styles.background}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.formContainer}>
                
                    <Text style={styles.labels}>Email</Text>
                    <TextInput style={styles.textInput} 
                    placeholder='Email'
                    onChangeText={(text) => setEmail(text)}
                    value={email}/>

                    <Text style={styles.labels}>Password</Text>
                    <TextInput style={styles.textInput}
                    secureTextEntry={true}
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}/>

                    {isVisible && (
                        <Text style={styles.errorMsg}>{errorMsg}</Text>
                    )}

                </View>
                
                <View style={styles.loginBtnView}>
                    <Pressable style={styles.login_button} onPress={onLoginPress} >
                        <Text style={styles.login_button_text}>Login</Text>
                    </Pressable>
                </View>
                
                <Text style={styles.text}>Don't have an account?<Text style={styles.signUpLink} onPress={onSignUpLinkPress}> Sign-Up Here</Text></Text>
            </ImageBackground>
        </SafeAreaView>

    );

}

// styling for login screen
const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
    },

    background: {
        flex: 1,

    },

    title: {

        marginLeft: 30,
        marginTop: 125, 
        padding: 10,
        fontSize: 40,
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
        width: 300,
    },

    labels: {

        fontSize: 15,
        padding: 10,
        marginLeft: 25,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    text: {

        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 80,
        borderRadius: 40,
        elevation: 3,
        backgroundColor: '#8B19FF',
        marginBottom: 10,
    },

    login_button_text: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'GTWalsheimPro-Regular',
    },

    loginBtnView: {

        width: 300,
        alignSelf: 'center',
        marginBottom: 15,

    },

    signUpLink: {
        color: "#8B19FF",
        fontWeight: "bold",
        fontSize: 13

    },
    errorMsg: {

        color: "red",
        fontSize: 15,
        marginLeft: 35,
        fontFamily: 'GTWalsheimPro-Regular',
    }

}); 

export default LoginScreen;