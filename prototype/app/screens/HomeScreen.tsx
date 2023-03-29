import React from 'react';
import {StyleSheet, View, Text, Image, Pressable  } from 'react-native';

function HomeScreen({navigation}: any) {

    const handleSPress = () => {
        navigation.navigate("SignUp");
    
    };

    const handleLPress = () => {
        navigation.navigate("Login");
    
    };

    return (
        
            /* Holds main screen contents */
            <>
            <View style={styles.screenLayout}>
                <Image source={require('../assets/economizer-logo5.jpg')} style={{width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center', marginTop: 100}}/>
                {/* Holds buttons */}
                <View style={styles.btncontainer}>
                
                        <Pressable style={styles.login_button} onPress={handleLPress} >
                            <Text style={styles.login_button_text}>Login</Text>
                        </Pressable>

                        <Pressable style={styles.signup_button} onPress={handleSPress}>
                            <Text style={styles.signup_button_text}>Sign Up</Text>
                        </Pressable>
                </View>
            </View>
            </>

    );
}

const styles = StyleSheet.create({

    screenLayout: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    btncontainer: {
        marginTop: 200,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    signup_button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 72,
        borderRadius: 40,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#8B19FF',
        marginTop: 10,
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

    signup_button_text: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#8B19FF',
    },

    login_button_text: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default HomeScreen;