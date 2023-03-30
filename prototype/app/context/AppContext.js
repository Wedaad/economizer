import React, { useContext, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const AppContext = React.createContext(); // creating the context

export function useAppConext() {

    return useContext(AppContext);
}

export function AppProvider({children}) {

    const [currentUser, setCurrentUser] = useState('');
    const [currentUserID, setCurrentUserID] = useState('');
    const [accessToken, setAccessToken] = useState(accessToken);

    // retrieving the access token stored in the database 
    const getAccessToken = async (userID) => {

        const currentUserDocument = await firestore().collection('Users').doc(userID).get();
        const userData = currentUserDocument.data();
        setAccessToken(userData.access_token) 

    }

    // getting the logged in user details from firestore (User collection)
    const getCurrentUserDetails = async (userID) => {
        
        await firestore().collection('Users').doc(userID).get()
        .then((user) => {
           
            setCurrentUser(user.data().username);
            setCurrentUserID(user.data().user_id);

        })
        .catch((error) => {

            console.log("CONTEXT ERROR:",error);
            return
        })
    }

    
    return (


        <AppContext.Provider value={{currentUser, currentUserID, accessToken, getAccessToken, getCurrentUserDetails}}>
            {children}
        </AppContext.Provider>

    )
}