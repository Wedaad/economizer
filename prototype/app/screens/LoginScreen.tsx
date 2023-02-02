/*
    User Login screen. If the details entered are the same as the details stored 
    in Firebase's Auth service then the user will login successfully
*/ 
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground, ScrollView, SafeAreaView, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

const screenBackground = require("../assets/LRScreenBackground3.png")
function LoginScreen({navigation}:any) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const onSignUpLinkPress = () => {

        navigation.navigate("SignUp");
    }

    const onLoginPress = () => {

        if(!email) {

            setIsVisible(true);
            setErrorMsg("Email field must be filled in.");
            return
        }

        if (!password) {

            setIsVisible(true);
            setErrorMsg("Password must be filled.");
            return
        }

        // if (!email && !password) {

        //     setIsVisible(true);
        //     setErrorMsg("Email and password fields must be filled to login.");
        //     return
        // }

        auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {

            const user = response.user.uid
            navigation.navigate("LinkAccount", {user_id: user, 
                username: username});    
        })
        .catch(error => {

            if(error.code == 'auth/invalid-email') {

                // Alert.alert('Login Error',
                // 'Invalid email format. Please enter in a correct email address.')
                setIsVisible(true);
                setErrorMsg('Invalid email address. Please enter a correct email address.');

            } 

            if(error.code == 'auth/wrong-password') {

                setIsVisible(true);
                setErrorMsg('Incorrect password.');
                // Alert.alert('Login Error',
                // 'Incorrect password.')
            }

            if(error.code == 'auth/user-not-found') {

                // Alert.alert('Login Error',
                // 'User not Found. Create an account to login.')
                setIsVisible(true);
                setErrorMsg('User not Found. Create an account to login.');

            }

            console.log("Error: " + error.code);
           

        })
    }

    return (
        <SafeAreaView style={styles.screenLayout}>
            {/* <ScrollView style={styles.scrollable}> */}
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
                    <Button title="Login" color="#BE7CFF" onPress={onLoginPress}/>
                </View>
                <Text style={styles.text}>Don't have an account?<Text style={styles.signUpLink} onPress={onSignUpLinkPress}> Sign-Up Here</Text></Text>
                </ImageBackground>
            {/* </ScrollView> */}
        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        // borderWidth: 4,
        // borderColor: 'orange',
        // backgroundColor: 'white',
    },

    background: {
        flex: 1,
        // borderWidth: 4,
        // borderColor: 'pink',
    },

    scrollable: {
        flex: 1,
        // borderWidth: 4,
        // borderColor: 'purple',

    },

    title: {

        // fontWeight: 'bold',
        marginLeft: 30,
        marginTop: 125, 
        padding: 10,
        fontSize: 35,
    },

    formContainer: {

        margin: 20,
        // borderWidth: 4,
        // borderColor: 'green',
    },

    textInput: {

        alignSelf: 'center',
        height: 50,
        marginBottom: 15,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
        width: 300,
    },

    labels: {

        fontSize: 15,
        padding: 10,
        marginLeft: 25,
    },

    text: {

        textAlign: 'center',
        fontSize: 13
    },

    loginBtnView: {

        width: 300,
        alignSelf: 'center',
        marginBottom: 15,
        // marginRight: 20,
      

    },
    signUpLink: {
        color: "#BE7CFF",
        fontWeight: "bold",
        fontSize: 13

    },
    errorMsg: {

        color: "red",
        fontSize: 10,
        marginLeft: 35,
    }

}); 

export default LoginScreen;