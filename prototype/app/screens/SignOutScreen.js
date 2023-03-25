import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function SignOutScreen() {

    const handleSOPress = () => {

        auth()
        .signOut()
        .then(() => {
            console.log('User signed out!');
        });
    
    };


  return (
    <View style={styles.screenLayout}>
        <Text style={styles.title}>Logging Out...</Text>
        <Text style={styles.subTitle}>Are you sure you want to sign out?</Text>

        <View>
            <Image source={require('../assets/icons/sign-out.png')} style={{width: 350, height: 350, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
        </View>

        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSOPress}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    screenLayout: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white'
    },

    title: {
        fontFamily: 'GTWalsheimPro-Regular',
        marginTop: 10, 
        fontSize: 25,
        textAlign: "center",
        
    },

    subTitle: {

        margin: 10, 
        fontSize: 17,
        fontFamily: 'GTWalsheimPro-Regular',
        textAlign: "center",

    },

    buttonView: {

        marginTop: 70,
        alignItems: 'center',
    },

    signOutButton: {

        position: 'absolute',
        padding: 10,
        backgroundColor: '#8B19FF',
        borderRadius: 10,
    },

    buttonText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 15,
        color: "white",
        justifyContent: 'flex-end',
        padding: 5,
      
    },
});