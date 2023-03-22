/*
    index.js – Configures the Plaid client and uses Express to define routes that call Plaid endpoints
    index.js: 
    - uses Express JS to create a server running on port 8085 
    - Express JS server used to define routes that call the Plaid API endpoints
    - Plaid client is also configured 
    - Environment variables are used to keep API Keys secure

    Plaid API Github repo (React Native): https://github.com/plaid/tiny-quickstart/tree/main/react_native 
*/
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const admin = require('firebase-admin');
const serviceAccount = require('../economizerServiceAccount.json');
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

// adding firestore to the server
admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});

const db = admin.firestore();

const app = express();

const PORT = 8085;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'development';
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME;
let current_date = new Date().toJSON().slice(0, 10);

app.use(
  
    session({secret: PLAID_SECRET, saveUninitialized: true, resave: true}),
);

// Configuration for the Plaid client
const config = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

//Creates a Link token and returns it to LinkAccountScreen
app.post('/link/token/create', async (req, res) => {

    console.log("Creating link token!!");
    let payload = {
        user: {client_user_id: req.body.userID},
        client_name: 'eConomizer',
        language: 'en',
        products: ['auth','transactions'],
        country_codes: ['US', 'IE'],
        android_package_name: PLAID_ANDROID_PACKAGE_NAME,
    };

    const tokenResponse = await client.linkTokenCreate(payload);
    res.json(tokenResponse.data.link_token);
    console.log("TOKEN ACQUIRED!! " + tokenResponse.data.link_token);
});

// Exchanges the public token from Plaid Link for an access token
app.post('/item/public_token/exchange', async (req, res) => {
    console.log("Exchanging token for access token!!");

    const exchangeResponse = await client.itemPublicTokenExchange({

      public_token: req.body.public_token,
      access_token: req.body.access_token
    });

    console.log("Public token: " + req.body.public_token);
    console.log("ACCESS TOKEN GENERATING FOR CURRENT USER ID:", req.body.userID)

    // Store access_token in the logged in user's document
    const currentUserDocument = db.collection('Users').doc(req.body.userID);
    
    res.json(true);
    console.log("TOKEN EXCHANGED!!");
    console.log("ACCESS TOKEN: " + exchangeResponse.data.access_token);
    
    // adding the access token to the current user's document
    return currentUserDocument.update({access_token: exchangeResponse.data.access_token})
    .then(() => console.log("Stored access token in Firestore"));
  }); 

// Retrieving user transactions
app.post('/transactions/get', async(req, res) => {
  console.log("SERVER> Retrieving transactions...");

  const access_token = req.body.access_token;
  console.log("ACCESS TOKEN ON SERVER SIDE:", access_token);
  let startDate = '2023-01-01';

  const transactions = await client.transactionsGet({

    access_token: access_token,
    start_date: startDate,
    end_date: current_date,

  })

  res.json({Transactions: transactions.data});

});

// Retrieving the users bank balance
app.post('/accounts/balance/get', async(req, res) => {
  const access_token = req.body.access_token;

  const balance = await client.accountsBalanceGet({

    access_token: access_token,
  
  })

  res.json({Balance: balance.data});

})
  
app.listen(PORT, () => {
console.log(`Server running on ${PORT}`);
});
