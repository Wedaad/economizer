import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { AntDesign  } from '@expo/vector-icons';
import { useAppConext } from '../context/AppContext';
import {API_KEY} from '@env';

export default function GroupInvite({groupID}) {
    
    const { currentUser } = useAppConext();
    const generateLink = async () => {
        console.log("Inside generate link")

        let response = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                dynamicLinkInfo: {
                    domainUriPrefix: "https://economizer.page.link",
                    link: "https://economizer.page.link/join-group",
                    androidInfo: {
                      "androidPackageName": "com.economizer.prototype"
                    }
                    
                }

            }) 
        });

        const link = await response.json()
        return link.shortLink
    }

    const shareLink = async () => {
        console.log("Calling Share Link")

        let shareURL;

        try {

            shareURL = await generateLink();
            console.log("URL Created: " + shareURL)
            
        } catch (error) {
            console.log("ERROR: When sharing link the following error occured: " + error)
            
        }

        // opening up sharing modal
        try {

            if(shareURL !== '') {

                await Share.share({
                    message: `${currentUser} has invited you to join a group sharing goal on eConomizer! ${shareURL}`
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
