import React from 'react';
import {StyleSheet, View, Text, Button } from 'react-native';

function HomeScreen({navigation}: any) {

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

    return (
            /* Holds main screen contents */
            <View style={styles.screenLayout}>
                <Text style={styles.title}>Welcome Screen</Text>
                <View style={styles.btncontainer}>
                    {/* Holds buttons */}
                    <View style={styles.btns}>
                        <Button title='Sign-Up' color="#BE7CFF" onPress={handleSPress} />
                    </View>
                    <View style={styles.btns}>
                    <Button title='Login' color="#BE7CFF" onPress={handleLPress} />
                    </View>
                    <View style={styles.btns}>
                        <Button title='Budgets' color="#BE7CFF" onPress={handleBPress} />
                    </View>
                </View>
            </View>
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
        marginTop: 280,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        // borderWidth: 4,
        // borderColor: 'red',
        padding: 8, 
        fontSize: 24,
        fontWeight: "bold",
    },

    btns: {
        flex: 1,
        margin: 10,
    },
});

export default HomeScreen;