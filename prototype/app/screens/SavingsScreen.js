import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, TextInput, ScrollView} from 'react-native';
import { Ionicons, AntDesign, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';
import SavingCard from '../components/SavingCard';
import { useAppConext } from '../context/AppContext';
import GroupInvite from '../components/GroupInvite';
import firestore from '@react-native-firebase/firestore';

export default function SharedBudgets() {

    const { currentUserID } = useAppConext();
    const [buttonPressed, setButtonPressed] = useState(false);
    const [savingsCardPressed, setSavingsCardPressed] = useState(false);
    const [personalSavingsPressed, setPersonalSavingsPressed] = useState(false);
    const [groupSavingsPressed, setGroupSavingsPressed] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalType, setGoalType] = useState('personal');
    const [selectedGoalName, setSelectedGoalName] = useState('');
    const [selectedGoalAmount, setSelectedGoalAmount] = useState(0);
    const [goalAmount, setGoalAmount] = useState(0);
    const [goals, setGoals] = useState([]); // stores all the goals in an array

    // function which handles the functionality for a personal saving goal
    const createPersonalSavingGoal = (name, amount) => {
        setButtonPressed(!buttonPressed);
        console.log("creating saving goal");
        console.log("Personal Goal Name:", name + " Goal Amount: ", amount);
    }


    // function which handles the functionality for a group saving goal
    const createGroupSavingGoal = (name, amount) => {
        setButtonPressed(!buttonPressed);
        setGoalType('Group');
        console.log("creating saving goal");
        console.log("Goal Name:", name + " Goal Amount: ", amount);
        // setGoals([...goals, {goalName: name, goalAmount: amount, type: 'Group'}]);
        
        try {

             // writing saving goal to the database
            const savingsCollectRef = firestore().collection('Users').doc(currentUserID)
            .collection('Savings').doc();

            savingsCollectRef.set({
                goalAmount: amount,
                goalName: name,
                goalType: goalType
            })
            .then(() => console.log("Savings goal has been added, with document ID:", savingsCollectRef.id))   

        } catch (error) {

            console.log("Error adding budget to firestore: " + error)
        }
       

    }
    
    // reading the saving goals from the savings 
    const getSavings = async () => {
        await firestore().collection('Users').doc(currentUserID).collection('Savings').get()
        .then((savingSnapshot) => {
            
            // console.log("Total number of saving goals stored in firestore:", savingSnapshot.size);
            
            const newData = savingSnapshot.docs
            .map((savingGoal) => ({

                ...savingGoal.data(), id:savingGoal.id
            }))
            
            setGoals(newData);
        })
    }
    
    getSavings();

    const onSavingCardPressed = (name, amount, goalType) => {
        console.log("Saving card pressed! Type of savings: " + goalType)
        console.log("Saving card pressed! For saving goal: " + name)
        console.log("Saving card pressed! Goal: " + amount)
        setSelectedGoalName(name);
        setSelectedGoalAmount(amount);
        setSavingsCardPressed(!savingsCardPressed);
    }

    // console.log("Goals[]:", goals);
    // console.log("Goals[].length:", goals.length);

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

                    <TouchableOpacity style={styles.addSavingsContainer} onPress={() => createPersonalSavingGoal(goalName, goalAmount)}>
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
                            <TouchableOpacity style={styles.addSavingsButton} onPress={() => createGroupSavingGoal(goalName, goalAmount)}>
                                    <Text style={styles.buttonText}>Create Savings Goal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }

        return ( // when the user presses create a saving goal
            
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
                <View style={styles.screenLayout}>
                    <View>
                        <Ionicons name="ios-arrow-back" size={30} color="black" onPress={() => setSavingsCardPressed(!savingsCardPressed)}/>
                    </View>

                    <View>
                        <Image source={require('../assets/icons/euro-vault.png')} style={{width: 230, height: 230, resizeMode: 'contain', alignSelf: 'center', marginTop: 35}}/>
                    </View>

                    <View style={{ marginTop: 10}}>
                        <Text style={styles.title}>{selectedGoalName}</Text>
                    </View>


                    <View style={{display:'flex', flexDirection: 'row', alignSelf: 'center', margin: 10}}>
                        <GroupInvite/>
                        <TouchableOpacity style={styles.addFundsButton}>
                            <MaterialIcons name="add" size={24} color="white" />
                            <Text style={{top: 2, fontFamily: 'GTWalsheimPro-Regular', color: "white", fontSize: 15}}>Add Funds</Text>
                        </TouchableOpacity>
                    </View>

                    <Text>TARGET: {selectedGoalAmount}</Text>
                    <Text>PROGRESS BAR</Text>
                </View>
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
                           
                            <Pressable onPress={() => onSavingCardPressed(goal.goalName, goal.goalAmount, "Group")}>
                                <SavingCard key={i} goalName={goal.goalName} goalAmount={goal.goalAmount} type={goalType}/>
                            </Pressable>
                        )
                    })
                }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  screenLayout: {
      padding: 20,
      flex: 1,
      backgroundColor: 'white',
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
      alignSelf: 'center'
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
      // borderWidth: 1
    
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

    // borderWidth: 2,
    // borderColor: 'blue',
    marginTop: 35,
    // backgroundColor: 'white',
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

    // borderWidth: 2,
    // borderColor: 'aqua',
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
    width: 170,
    backgroundColor: '#8B19FF',
    marginLeft: 10,

  },

});
