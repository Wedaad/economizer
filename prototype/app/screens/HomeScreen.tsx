import React from 'react';
import {StyleSheet, View, Text, Button, Image, Pressable  } from 'react-native';
import { useFonts } from 'expo-font';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

function HomeScreen({navigation}: any) {

    const [loaded] = useFonts({
        Rubik: require('../assets/fonts/Rubik-Regular.ttf'),
        // Rubik: require('../assets/fonts/Rubik-Bold.ttf'),
    });

    const handleSPress = () => {
        console.log("SignUp button was just pressed")
        navigation.navigate("SignUp");
        // console.log(firebase);
    
    };

    const handleLPress = () => {
        console.log("Login button was just pressed")
        navigation.navigate("Login");
    
    };

    const handleBPress = () => {
        console.log("Budgets button was just pressed")
        navigation.navigate("Budgets");
    
    };

    const handleDPress = () => {
        console.log("Dashboard button was just pressed")
        navigation.navigate("Dashboard");
    
    };

    const handleSOPress = () => {
        console.log("Signout button was just pressed")
        navigation.navigate("Logout");
    
    };

    if(!loaded) {

        return null;
    }


    return (
            /* Holds main screen contents */
            <>
            <View style={styles.screenLayout}>
                <Image source={require('../assets/economizer-logo5.jpg')} style={{width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center', marginTop: 100}}/>
                <View style={styles.btncontainer}>
                    {/* Holds buttons */}
                    <View style={styles.btns}>

                        <Pressable style={styles.login_button} onPress={handleLPress} >
                            <Text style={styles.login_button_text}>Login</Text>
                        </Pressable>

                        <Pressable style={styles.signup_button} onPress={handleSPress}>
                            <Text style={styles.signup_button_text}>Sign Up</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
            </>

    );
}

const styles = StyleSheet.create({

    screenLayout: {
        // borderWidth: 4,
        // borderColor: 'orange',
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    btncontainer: {
        // borderWidth: 4,
        // borderColor: 'green',
        marginTop: 200,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        // borderWidth: 4,
        // borderColor: 'red',
        fontFamily: 'Rubik',
        padding: 8, 
        fontSize: 24,
        // fontWeight: "bold",
    },

    btns: {
        margin: 10,
    },

    signup_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 80,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#8B19FF',
    },

    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 80,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#8B19FF',
        marginBottom: 10,
    },

    signup_button_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#8B19FF',
    },

    login_button_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default HomeScreen;