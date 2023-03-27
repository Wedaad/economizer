import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { AntDesign  } from '@expo/vector-icons';
import { useAppConext } from '../context/AppContext';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function GroupInvite({groupID}) {

    const { currentUser } = useAppConext();

    const generateLink = async () => {

        const link = await dynamicLinks().buildLink({
            link: encodeURI(`https://economizer.page.link/join-group/${groupID}`),
            domainUriPrefix: "https://economizer.page.link",
            android: {
                packageName: "com.economizer.prototype"
            }
        });

        
        return link;
    }

    const shareLink = async () => {

        let shareURL;

        try {

            shareURL = await generateLink();
            
            
        } catch (error) {
            console.log("ERROR: When sharing link the following error occured: " + error)
            
        }

        // opening up sharing modal
        try {

            if(shareURL !== '') {

                await Share.share({
                    message: `${currentUser} has invited you to join a group budget on eConomizer! ${shareURL}`
                })
            }
            
        } catch (error) {
            console.log("ERROR: When opening up modal for sharing link the following error occured: " + error)
            
        }
    }

  return (
    <View>
        <TouchableOpacity style={styles.addGroupMemeberButton} onPress={shareLink}>
            <AntDesign name="adduser" size={24} color="white" />
            <Text style={{top: 2, fontFamily: 'GTWalsheimPro-Regular', color: "white", textAlign: 'center'}}>Add Group Member</Text>
            </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  
    addGroupMemeberButton: {
      display: 'flex', 
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: '#8B19FF',
      padding: 10, 
      borderRadius: 15,
      width: 170,
      backgroundColor: '#8B19FF'
  
    },
  
  });
