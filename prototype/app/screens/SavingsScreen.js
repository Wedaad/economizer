import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, TextInput} from 'react-native';
import { Ionicons, AntDesign, MaterialCommunityIcons  } from '@expo/vector-icons';

export default function SharedBudgets({navigation}) {

    const [buttonPressed, setButtonPressed] = useState(false);
    const [personalSavingsPressed, setPersonalSavingsPressed] = useState(false);
    const [groupSavingsPressed, setGroupSavingsPressed] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState(0);
    const [goals, setGoals] = useState([]); // stores all the goals in an array

    const createSavingPersonalGoal = () => {
        console.log("creating saving goal");
        // console.log("Goal Name:" + " Goal Amount: ");


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
                        onChange={(name) => setGoalName(name)}
                        value={goalName}/>

                        <TextInput
                        style={styles.textInput}
                        placeholder='Amount you want to Save'
                        keyboardType='numeric'
                        onChange={(amount) => setGoalAmount(amount)}
                        value={goalAmount}/>
                    </View>

                    <TouchableOpacity style={styles.addSavingsContainer} onPress={createSavingPersonalGoal(goalName, goalAmount)}>
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
                        placeholder='Name your Savings Goal'/>

                        <TextInput
                        style={styles.textInput}
                        placeholder='Amount you want to Save'
                        keyboardType='numeric'/>
                    </View>

                    <TouchableOpacity style={styles.addSavingsContainer} onPress={createSavingPersonalGoal}>
                        <View style={styles.addSavingsButton}>
                            <Text style={styles.buttonText}>Create Savings Goal</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
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
                                <Text style={styles.screenText}>Save with friends</Text>
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

  addSavingsContainer: {

    marginTop: 40,

  },

  addSavingsButton: {

      position: 'absolute',
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

  }

});
