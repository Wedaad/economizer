import React, {useState} from 'react';
import {StyleSheet, View, Text, Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function SignUpScreen({navigation}:any) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const onLoginLinkPress = () => {

        console.log("Login link clicked");
        navigation.navigate("Login")
    }

    const onSignUpPress = () => {

        if(password !== confirmPassword) {

            alert("Passwords don't match");
            return
        }

        auth()
        .createUserWithEmailAndPassword(email, password)
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
                alert("Registration Successful");
                navigation.navigate("Login"); // change the screen to the login screen once registration is successful 
            })
            .catch((error) => {
                alert("SignUp Error: " + error)});
        })
        .catch((error) => {
            alert("SignUp Error: " + error)});

    }

    return (
        /* Holds main screen contents */
        <View style={styles.screenLayout}>
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

            </View>

            <View style={styles.signUpBtn}>
                <Button title="Sign Up" color="#BE7CFF" onPress={onSignUpPress}/>
            </View>

            <Text style={styles.text}>Already have an account? <Text onPress={onLoginLinkPress} style={styles.loginLink}>Login Here</Text></Text>
            </View>
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
        marginTop: 40, 
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