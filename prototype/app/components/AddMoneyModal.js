import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker'

export default function AddMoneyModal({isVisible, onClose, goalID, onAddMoneyClick}) {

    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date())
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    // clears modal fields when modal is closed
    const clearModalInputs = () => {
        setDescription('');
        setAmount(0);
    }

    return (

        <Modal isVisible={isVisible}>
            <View style={styles.modalViewStyle}>
                <View style={styles.modalViewElements}>
                    <Text style={styles.modalTitle}>Add Money</Text>
                    <Ionicons name="close" size={30} color="black" style={styles.closeIcon} onPress={onClose}/>
                </View>

                <View style={styles.addFundsForm}>

                    <Text style={styles.labels}>Amount</Text>
                    <TextInput style={styles.textInput}
                    value={amount}
                    onChangeText={(amount) => setAmount(amount)}
                    keyboardType='numeric'
                    />

                    <Text style={styles.labels}>Description</Text>
                    <TextInput style={styles.textInput}
                    value={description}
                    onChangeText={(desc) => setDescription(desc)}
                    />

                    <DatePicker
                        modal
                        mode='date'
                        open={isDatePickerOpen}
                        date={date}
                        onConfirm={(date) => {
                            setIsDatePickerOpen(false)
                            setDate(date)
                        }}
                            onCancel={() => {
                            setIsDatePickerOpen(false)
                        }}
                    />
                </View>

                <View style={styles.addFundsBtnView}>

                    <TouchableOpacity onPress={() => setIsDatePickerOpen(true)} style={{backgroundColor: '#8B19FF', padding: 10, borderRadius: 10,}}>
                        <Text style={{fontFamily:"GTWalsheimPro-Regular", color: 'white'}}>Pick a date for this transaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addFundsBtn}  onPress={() => {onAddMoneyClick(amount, description, goalID, date, clearModalInputs())}}>
                        <Text style={styles.addFundsBtnText}>Add Money</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )

}

// styling for add money modal
const styles = StyleSheet.create({

    modalViewStyle: {
        height: 400,
        backgroundColor: 'white',
        borderRadius: 15,
    },

    modalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
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

    addFundsForm: {
        padding: 20,

    },

    addFundsBtn: {

        padding: 10,
        color: 'white',
        backgroundColor: '#8B19FF',
        borderRadius: 10,
    },

    addFundsBtnView: {

        alignItems: 'center', 
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        margin: 20,
    },
    
    addFundsBtnText: {

        color: 'white',
        fontFamily: 'GTWalsheimPro-Regular',
    },

    labels: {

        fontSize: 15,
        margin: 10,
        fontFamily: 'GTWalsheimPro-Regular',
    },

    textInput: {
        
        height: 50,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 10,
    },
})