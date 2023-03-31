import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, StyleSheet , TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import RadioButtonRN from 'radio-buttons-react-native';
import CategoryList from '../components/CategoryList';


export default function AddBudgetModal({isVisible, closeModal, onCreateBudgetClick, isErrorVisible, errorMessage}) {

    const [budgetName, setBudgetName] = useState('');
    const [category, setCategory] = useState();
    const [budgetType, setBudgetType] = useState('');
    const [amountAllocated, setAmountAllocated] = useState(0);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    const button_labels = [

        {
            label: 'weekly'
        },

        {
            label: 'monthly'
        },

    ];

    // function that clears the input fields
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
                        onChangeText={(name) => {setBudgetName(name)}}
                        value={budgetName}/>

                        <Text style={styles.labels}>Category</Text>
                        {
                            category && (
                                <Text style={styles.labels}>Chosen category is: {category.name}</Text>
                            )
                        }
                        <TouchableOpacity onPress={() => setCategoryModalVisible(!categoryModalVisible)} style={{width: 140,...styles.addBudgetBtn}}>
                            <Text style={{color:'white', fontFamily:"GTWalsheimPro-Regular"}}>Choose a category</Text>
                        </TouchableOpacity>

                        <Modal isVisible={categoryModalVisible} avoidKeyboard={true} onBackButtonPress={() => setCategoryModalVisible(false)} style={styles.categoryModalStyle}>
                            <View style={styles.categoryModalViewStyle}>
                                <View style={styles.categoryModalViewElements}>
                                    <AntDesign name="arrowleft" size={30} color="black" onPress={() => setCategoryModalVisible(false)}/>
                                </View>
                                <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Bold"}}>Select a Category</Text>
                                <Text style={{textAlign: 'center', fontFamily: "GTWalsheimPro-Regular", marginTop: 5, marginBottom: 10}}>Select a category you wish to associate with this transaction</Text>

                                <View>
                                    <CategoryList closeModal={setCategoryModalVisible} setCategoryChosen={setCategory}/>
                                </View>
                            </View>
                        </Modal>

                        <Text style={styles.labels}>Amount Allocated</Text>
                        <TextInput style={styles.textInput}
                        onChangeText={(amount) => setAmountAllocated(amount)}
                        keyboardType='numeric'
                        value={amountAllocated}/>
                            
                        <Text style={styles.labels}>Choose a Budget Type:</Text>
                        <RadioButtonRN
                            data={button_labels}
                            selectedBtn={(e) => setBudgetType(e.label)}
                            box={false}
                            circleSize={13}
                        />

                        {
                            isErrorVisible && (

                                <Text style={{color: 'red', fontFamily: 'GTWalsheimPro-Regular', marginTop:10, fontSize: 17}}>Error: {errorMessage}</Text>
                            )
                        }
                        
                        <View style={styles.addBudgetBtnView}>              
                            {/* Calling the create budget function and passing in the budget details entered by the user */}
                            <TouchableOpacity style={styles.addBudgetBtn} onPress={() => onCreateBudgetClick(budgetName, category, amountAllocated, budgetType,clearModalInputs())}>
                                <Text style={styles.addBudgetBtnText}>Create Budget</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        
                </View>
            </Modal>

    )
}

// styling for the add budget modal component
const styles = StyleSheet.create({

    modalViewStyle: {
        height: 600,
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

    addBudgetForm: {
        padding: 20,

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

    categoryModalStyle: {
      
        backgroundColor: 'white',
       

    },

    categoryModalViewStyle: {
        padding: 10,
        backgroundColor: 'white',
    },

    categoryModalViewElements: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,

    },

});