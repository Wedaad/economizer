import React, { useState, useRef } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import IconPicker from "react-native-icon-picker";
import RadioButtonRN from 'radio-buttons-react-native';


export default function AddBudgetModal({isVisible, closeModal, onCreateBudgetClick}) {

    const [budgetName, setBudgetName] = useState('');
    const [category, setCategory] = useState('');
    const [budgetType, setBudgetType] = useState('');
    const [amountAllocated, setAmountAllocated] = useState(0);

    const button_labels = [

        {
            label: 'weekly'
        },

        {
            label: 'monthly'
        },

        {
            label: 'annually'
        }
    ];

    const clearModalInputs = () => {

        setBudgetName('');
        setCategory('');
        setAmountAllocated(0);
    }

    return (
        
        <Modal isVisible={isVisible} avoidKeyboard={true}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.modalViewElements}>
                        <Text style={styles.modalTitle}>Add New Budget</Text>
                        <Ionicons name="close" size={30} color="black" onPress={closeModal} style={styles.closeIcon}/>
                    </View>

                    <View style={styles.addBudgetForm}>
                        <Text style={styles.labels}>Budget Name</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(name) => setBudgetName(name)}
                        value={budgetName}/>

                        <Text style={styles.labels}>Category</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(category) => setCategory(category)}
                        value={category}/>

                        <Text style={styles.labels}>Amount Allocated</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(amount) => setAmountAllocated(amount)}
                        keyboardType='numeric'
                        value={amountAllocated}/>
                            
                        <Text style={styles.labels}>Choose a Budget Type:</Text>
                        <RadioButtonRN
                            data={button_labels}
                            selectedBtn={(e) => {
                                console.log("Budget Type chosen is:", e.label)
                                setBudgetType(e.label);
                            }}
                            box={false}
                            circleSize={13}
                        />

                        <View style={styles.addBudgetBtnView}>
                            <TouchableOpacity style={styles.addBudgetBtn} onPress={() => onCreateBudgetClick(budgetName, category, amountAllocated, budgetType,clearModalInputs())}>
                                <Text style={styles.addBudgetBtnText}>Create Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        
                </View>
            </Modal>

    )
}

const styles = StyleSheet.create({

    modalViewStyle: {
        // flex: 0.7,
        height: 600,
        backgroundColor: 'white',
        borderRadius: 15,
        // position: 'absolute',
        // borderWidth: 3,
        // borderColor: 'brown',

    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 3,
        // borderColor: 'yellow',

    },

    modalTitle: {
        marginLeft: 15, 
        fontSize: 25,
        fontFamily: 'GTWalsheimPro-Regular',
        marginTop: 25,
    },

    closeIcon: {
        margin: 15,
    },

    addBudgetForm: {
        // borderWidth: 5,
        // borderColor: 'navy',
        padding: 20,

    },
    
    labels: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    textInput: {

        // marginLeft: 15,
        height: 50,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
    },

    addBudgetBtnView: {

        alignItems: 'center', 
        margin: 20,

    },

    addBudgetBtnText: {

        color: 'white',
        fontFamily: 'GTWalsheimPro-Regular',
    },

    addBudgetBtn: {

        padding: 10,
        color: 'white',
        backgroundColor: '#8B19FF',
        borderRadius: 10,
    },

    iconSelectorPrompt: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
        borderRadius: 10,
        backgroundColor: '#8B19FF',
        color: "white",
        padding: 10,
        width: 165,
    },


});