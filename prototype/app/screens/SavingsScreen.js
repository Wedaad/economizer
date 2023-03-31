import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, TextInput, ScrollView} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons  } from '@expo/vector-icons';
import SavingCard from '../components/SavingCard';
import { useAppConext } from '../context/AppContext';
import GroupInvite from '../components/GroupInvite';
import { Bar as ProgressBar } from 'react-native-progress';
import firestore from '@react-native-firebase/firestore';
import BudgetTransactionCard from '../components/BudgetTransactionCard';
import AddMoneyModal from '../components/AddMoneyModal';

export default function SharedBudgets() {

    const { currentUserID } = useAppConext();
    const [buttonPressed, setButtonPressed] = useState(false);
    const [savingsCardPressed, setSavingsCardPressed] = useState(false);
    const [personalSavingsPressed, setPersonalSavingsPressed] = useState(false);
    const [groupSavingsPressed, setGroupSavingsPressed] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState(0);
    const [selectedGoalName, setSelectedGoalName] = useState('');
    const [selectedGoalID, setSelectedGoalID] = useState('');
    const [selectedGoalAmount, setSelectedGoalAmount] = useState(0);
    const [selectedGoalAmountSaved, setSelectedGoalAmountSaved] = useState(0);
    const [goals, setGoals] = useState([]); // stores all the goals in an array
    const [goalTransactions, setGoalTransactions] = useState([]); // stores all the goal transactions in an array
    const [isAddMoneyModalVisible, setAddMoneyModalVisible] = useState(false);

    let amountSaved = 0;

    // function which handles the functionality for a personal saving goal
    const createPersonalSavingGoal = (name, amount, goalType) => {

        setButtonPressed(!buttonPressed);

        try {
            // writing saving goal to the database
            const savingsCollectRef = firestore().collection('Savings').doc();

            savingsCollectRef.set({
                goalAmount: amount,
                goalName: name,
                goalType: goalType,
                goalID: savingsCollectRef.id,
                amountSaved: 0,
                userID: currentUserID,

            }, {merge: true})
            .then(() => console.log("Savings goal has been added, with document ID:", savingsCollectRef.id))   

        } catch (error) {

            console.log("Error adding budget to firestore: " + error)
        }
    }


    // function which handles the functionality for a group saving goal
    const createGroupSavingGoal = (name, amount, goalType, goalMembers) => {

        setButtonPressed(!buttonPressed);
        
        try {

            // writing saving goal to the database
            const savingsCollectRef = firestore().collection('Savings').doc();

            savingsCollectRef.set({
                goalAmount: amount,
                goalName: name,
                goalType: goalType,
                goalMembers: goalMembers,
                goalID: savingsCollectRef.id,
                amountSaved: 0,
                // userID: currentUserID,
            }, {merge: true})
            .then(() => console.log("Savings goal has been added, with document ID:", savingsCollectRef.id))   

        } catch (error) {

            console.log("Error adding budget to firestore: " + error)
        }
       
    }
    
    // reading the saving goals from the savings 
    const getSavings = async () => {

        const savingsCollectionRef  = firestore().collection('Savings');
        const isAdmin = savingsCollectionRef.where('userID', '==', currentUserID).get();
        const isMember = savingsCollectionRef.where('goalMembers', 'array-contains', currentUserID).get();

        const [adminQuerySnapshot, memberQuerySnapshot] = await Promise.all([isAdmin, isMember]);

        const adminArrayData = adminQuerySnapshot.docs;
        const memberArrayData = memberQuerySnapshot.docs;

        const userData = adminArrayData.concat(memberArrayData);

        return userData;

    }

    // retrieving the saving goals from Firestore
    getSavings().then(goalSnapshot => {

        const goalData = goalSnapshot
        .map((savingGoal) => ({

            ...savingGoal.data(), id:savingGoal.id
        }));

        setGoals(goalData);  // setting goal data

    })

    const onSavingCardPressed = (name, amount, id, amountSaved) => {
        setSelectedGoalName(name);
        setSelectedGoalAmount(amount);
        setSelectedGoalID(id);
        setSavingsCardPressed(!savingsCardPressed);
        getSavingsTransactions(id);
        setSelectedGoalAmountSaved(parseFloat(amountSaved));
        
    }
    
    const onAddMoneyPressed = (amount, description, goalID, date) => {
        setAddMoneyModalVisible(false);
        const transactionCollectionRef = firestore().collection('Transactions').doc();
        const goalCollectionRef = firestore().collection('Savings').doc(goalID);

        goals.forEach (goal => {

            if (goal.goalID === goalID) {
                goal.amountSaved += parseFloat(amount);
                amountSaved = goal.amountSaved;
            }
        })

        try {   

            // updating the amount saved in the savings document
            goalCollectionRef.set({

                amountSaved: parseFloat(amountSaved),

            }, {merge: true})
            .then(() => console.log("Amount saved has been updated"));
            
            // writing the transaction to firestore
            transactionCollectionRef.set({
                amount: amount,
                goalID: goalID,
                description: description,
                date: date,
                userID: currentUserID,

            }, {merge: true})
            .then(() => console.log("Transaction has been added, with document ID:", transactionCollectionRef.id))

        } catch (error) {
            console.log("Error adding saving transaction to firestore: " + error)
        }
       
    }

    // Retrieving transactions from Firestore
    const getSavingsTransactions = async (goalID) => {

        await firestore().collection('Transactions').where('goalID', '==', goalID).get()
        .then(transactionSnapshot => {

            const transactionData = transactionSnapshot.docs
            .map((transaction) => ({
                
                amount: transaction.data().amountSaved,
                description: transaction.data().description,
                ...transaction.data(), id:transaction.id
            }));

            setGoalTransactions(transactionData); // setting transaction data 
        }) 
        
    }
 
    if(buttonPressed) { // if the user wants to create a saving goal

        if (personalSavingsPressed) { // if the user wants to create a personal saving goal
            return (

                <View style={styles.screenLayout}>
                    <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => {
                        setButtonPressed(true)
                        setPersonalSavingsPressed(!personalSavingsPressed)
                    }}/>
                    <Image source={require('../assets/icons/euro-savings-icon.png')} style={{width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                    <Text style={styles.title}>Add a Savings Goal</Text>

                    <View style={styles.textInputView}>
                        <TextInput
                        style={styles.textInput}
                        placeholder='Name your Savings Goal'
                        onChangeText={(name) => setGoalName(name)}
                        value={goalName}/>

                        <TextInput
                        style={styles.textInput}
                        placeholder='Amount you want to Save'
                        keyboardType='numeric'
                        onChangeText={(amount) => setGoalAmount(amount)}
                        value={goalAmount}/>
                    </View>

                    <TouchableOpacity style={styles.addSavingsContainer} onPress={() => createPersonalSavingGoal(goalName, goalAmount, 'personal')}>
                        <View style={styles.addSavingsButton}>
                            <Text style={styles.buttonText}>Create Savings Goal</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } 

        if(groupSavingsPressed) { // if the user chooses to create a group savings goal
            
            return (

                <View style={styles.screenLayout}>
                    <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => {
                        setButtonPressed(true);
                        setGroupSavingsPressed(!groupSavingsPressed)}}
                    />
                    <Image source={require('../assets/icons/euro-savings-icon.png')} style={{width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                    <Text style={styles.title}>Create a Group Savings Goal</Text>

                    <View style={styles.textInputView}>
                        <TextInput
                        style={styles.textInput}
                        placeholder='Name your Savings Goal'
                        onChangeText={(name) => setGoalName(name)}
                        value={goalName}/>

                        <TextInput
                        style={styles.textInput}
                        placeholder='Amount you want to Save'
                        onChangeText={(amount) => setGoalAmount(amount)}
                        keyboardType='numeric'
                        value={goalAmount}/>

                        <View style={styles.addSavingsButtonView}>
                            <TouchableOpacity style={styles.addSavingsButton} onPress={() => createGroupSavingGoal(goalName, goalAmount, "Group", [`${currentUserID}`])}>
                                    <Text style={styles.buttonText}>Create Savings Goal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }

        return ( // when the user presses add a saving goal
            
            <>
                <View style={styles.screenLayout}>

                    <View style={styles.headerContainer}>
                        <View style={styles.iconView}>
                            <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => setButtonPressed(!buttonPressed)}/>
                        </View>
                        <View>
                            <Text style={styles.title}>Create a Savings Goal</Text>
                        </View>
                    </View>

                    <Text style={styles.subTitle}>Start saving by yourself or with others!</Text>

                    <View style={styles.optionView}>
                        <Pressable onPress={() => setPersonalSavingsPressed(!personalSavingsPressed)} style={({pressed}) => [{
                                
                                backgroundColor: pressed ? '#E6C6FF' : 'white',
                                borderRadius: 15,
                            }]}>
                            <View style={styles.optionCard}>
                                <Text style={styles.screenText}>Save for a personal Goal</Text>
                                <View style={styles.icon}>
                                    <AntDesign name="right" size={15} color="black"/>
                                </View>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => setGroupSavingsPressed(!groupSavingsPressed)} style={({pressed}) => [{
                            
                            backgroundColor: pressed ? '#E6C6FF' : 'white',
                            borderRadius: 15,
                        }]}>
                            <View style={styles.optionCard}>
                                <Text style={styles.screenText}>Save with a group</Text>
                                <View style={styles.icon}>
                                    <AntDesign name="right" size={15} color="black"/>
                                </View>
                                
                            </View>
                        </Pressable>
                    </View>
                </View>
            </>
            
        )

    }
    
    if(goals.length == 0) { //  LANDING PAGE FOR THIS SCREEN IF NO SAVING GOALS HAVE BEEN MADE

        return (

            <View style={styles.screenLayout}>
                <Text style={styles.title}>Savings</Text>
                <Text style={styles.subTitle}>Create saving goals either for yourself or with friends & Family.
                Save money to reach your financial goals faster! </Text>
    
                <View>
                    <Image source={require('../assets/icons/savings.png')} style={{width: 350, height: 350, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                </View>
    
                <View style={styles.addSavingsContainer}>
                    <TouchableOpacity style={styles.addSavingsButton} onPress={() => setButtonPressed(!buttonPressed)}>
                        <Text style={styles.buttonText}>Start Saving Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    } else { // displaying created saving goals if the user has some created

        if (savingsCardPressed) {

            return (
                <ScrollView style={styles.screenLayout}>
                    <View>
                        <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => setSavingsCardPressed(!savingsCardPressed)}/>
                    </View>

                    <Text style={{textAlign: 'center', fontSize: 30, fontFamily: "GTWalsheimPro-Bold"}}>Saving Goal</Text>
                    <Text style={{textAlign: 'center', fontSize: 17, fontFamily: "GTWalsheimPro-Regular"}}>Add funds to saving goal to reach your target!</Text>

                    <View>
                        <Image source={require('../assets/icons/euro-vault.png')} style={{width: 230, height: 230, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                    </View>

                    <View style={{ marginTop: 10}}>
                        <Text style={styles.title}>Goal Name: {selectedGoalName}</Text>
                    </View>

                    <View style={{alignItems: 'center'}}>

                    </View>


                    <View style={{display:'flex', flexDirection: 'row', alignSelf: 'center'}}>
                        <GroupInvite groupID={selectedGoalID}/>
                        <TouchableOpacity style={styles.addFundsButton} onPress={() => setAddMoneyModalVisible(!isAddMoneyModalVisible)}>
                            <MaterialIcons name="add" size={24} color="white" />
                            <Text style={{top: 4, fontFamily: 'GTWalsheimPro-Regular', color: "white", fontSize: 15}}>Add Money</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.progressBarView}>
                        <Text  style={{textAlign: 'center', fontFamily: 'GTWalsheimPro-Regular', fontSize: 25}}>TARGET: &euro;{selectedGoalAmount}</Text>
                        <ProgressBar progress={selectedGoalAmountSaved/selectedGoalAmount} width={300} unfilledColor={'white'} color={'#8B19FF'} style={{margin: 20}}/>
                    </View>

                    <Text style={{fontFamily: 'GTWalsheimPro-Regular', fontSize: 20}}>Transactions</Text>

                    <View style={styles.transactionsView}>

                        {/* if the user has no transactions for a particular saving goal */}
                        {
                            goalTransactions.length === 0 && (
                            
                            <Text style={{fontFamily: 'GTWalsheimPro-Regular', fontSize: 20}}>You haven't made any transactions for this saving goal. 
                            Start adding money and reach your target!</Text>)
                        }


                        {/* if the user has transactions for a particular saving goal */}
                        {

                            goalTransactions.length > 0 && (
                                goalTransactions.map((transaction, index) => (
                                    <BudgetTransactionCard key={index} amount={transaction.amount} description={transaction.description} />
                                ))
                            )
                        }
                    </View>

                    {/* if the user presses the add money button - modal will display */}
                
                    {
                        isAddMoneyModalVisible && 
                        <AddMoneyModal isVisible={isAddMoneyModalVisible} onClose={() => setAddMoneyModalVisible(!isAddMoneyModalVisible)} 
                            goalID={selectedGoalID} onAddMoneyClick={onAddMoneyPressed}
                        />
                        
                    }

                    <View style={{height: 180, backgroundColor: '#fafafa'}}>
                        {
                            selectedGoalAmountSaved > 0 && (

                                <View style={{position: 'absolute', top: 0, alignSelf: 'center', justifyContent: 'center', margin: 20}}>
                                   
                                    <Text style={{textAlign: 'center', fontSize: 20, fontFamily: "GTWalsheimPro-Regular"}}>TOTAL AMOUNT SAVED: &euro;{selectedGoalAmountSaved}</Text>
                                    <Text style={{fontFamily: 'GTWalsheimPro-Regular', fontSize: 20, textAlign: 'center', margin: 10}}>Target hasn't been reached yet. You need &euro;{selectedGoalAmount-selectedGoalAmountSaved} more to reach your target!</Text>
                                   
                                </View>

                            )
                        }

                        {
                            selectedGoalAmountSaved < 0 && (

                                <View style={{position: 'absolute', top: 0, alignSelf: 'center', justifyContent: 'center', margin: 20}}>
                                    <Text style={{fontFamily: 'GTWalsheimPro-Regular', fontSize: 20, textAlign: 'center'}}>Target hasn't been reached yet. You need €X more to reach your target!</Text>
                                </View>

                            )
                        }

                    </View>
                    <View style={{height: 100, backgroundColor: '#fafafa'}}></View>
                </ScrollView>
            )
        }

        return (
            <ScrollView style={styles.screenLayout}>
                <View style={{display: 'flex', flexDirection:'row-reverse'}}>
                    <TouchableOpacity style={styles.addGoalButton} onPress={() => setButtonPressed(!buttonPressed)}>
                        <Text style={styles.buttonText}>Add Goal</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Your Saving Goals</Text>
                <View style={styles.savingCardView}>
                {
                    goals.map((goal, i) => {

                        return (
                           
                            <Pressable key={i} onPress={() => onSavingCardPressed(goal.goalName, goal.goalAmount, goal.goalID, goal.amountSaved)}>
                                <SavingCard goalName={goal.goalName} goalAmount={goal.goalAmount} type={goal.goalType}/>
                            </Pressable>
                        )
                    })
                }
                </View>
                <View style={{height: 140, backgroundColor: '#fafafa'}}></View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    screenLayout: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fafafa',
    },

    screenText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 17,
    },

    title: {
        fontFamily: 'GTWalsheimPro-Regular',
        marginTop: 10, 
        fontSize: 25,
        textAlign: "center",
        bottom: 5,
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

    addSavingsButtonView: {
        alignItems: 'center', 
        margin: 20,

    },

    addSavingsButton: {
        position: 'absolute',
        padding: 10,
        backgroundColor: '#8B19FF',
        borderRadius: 10,
        alignSelf: 'center',
        margin: 15
    },

    addGoalButton: {
        padding: 10,
        backgroundColor: '#8B19FF',
        borderRadius: 10,
        alignSelf: 'center'
    },

    buttonText: {
        fontFamily: 'GTWalsheimPro-Regular',
        fontSize: 15,
        color: "white",
        justifyContent: 'flex-end',
        padding: 5,        
    },

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    iconView: {
        right: 50,
    },

    optionView: {
        marginTop: 35,
    },

    optionCard: {
        borderWidth: 2, 
        borderColor: '#8B19FF',
        borderRadius: 15,
        padding: 25,
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        
    },

    icon: {
        position: 'absolute',
        left: 300,
        bottom: 25,
    },

    textInputView: {
        marginTop: 20,

    },

    textInput: {
        margin: 5,
        borderColor: '#9B9B9B',
        color: 'black',
        borderWidth: 1.5,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#fafafa'

    },

    savingCardView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        flexWrap: 'wrap'

    },

    addFundsButton: {
        display: 'flex', 
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#8B19FF',
        padding: 10, 
        borderRadius: 15,
        marginLeft: 5,
        backgroundColor: '#8B19FF',

    },

    progressBarView: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,

    },

    transactionsView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginTop: 15,
    }

});
