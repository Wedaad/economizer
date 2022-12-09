/*
    User Login screen. If the details entered are the same as the details stored 
    in Firebase's Auth service then the user will login successfully
*/ 
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

function LoginScreen({navigation}:any) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const onSignUpLinkPress = () => {

        navigation.navigate("SignUp");
    }

    const onLoginPress = () => {

        auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {

            const user = response.user.uid
            navigation.navigate("LinkAccount", {user_id: user, 
                username: username});
        })
        .catch(error => {

            alert("Login Error: " + error)
            console.log(error);
        })
    }

    return (
        <View style={styles.screenLayout}>
            <Text style={styles.title}>Login</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.labels}>Username</Text>
                        <TextInput 
                        style={styles.textInput} 
                        placeholder='Username'
                        onChangeText={(text) => setUsername(text)} // setting the value of username to the username entered
                        value={username}/>
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
                </View>

            <View style={styles.loginBtn}>
                <Button title="Login" color="#BE7CFF" onPress={onLoginPress}/>
            </View>
            <Text style={styles.text}>Don't have an account?<Text style={styles.signUpLink} onPress={onSignUpLinkPress}>Sign-Up Here</Text></Text>
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