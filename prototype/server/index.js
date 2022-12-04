/*
    index.js – Configures the Plaid client and uses Express to defines routes that call Plaid endpoints in the Sandbox environment.
    index.js: 
    - uses Express JS to create a server running on port 8085 
    - Express JS server used to define routes that call the Plaid API endpoints (sandbox environment)
    - Plaid client is also configured 
    - Environment variables are used to keep API Keys secure

    Plaid API Github repo (React Native): https://github.com/plaid/tiny-quickstart/tree/main/react_native 
*/
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const app = express();
const PORT = 8085;

app.use(
    // FOR DEMO PURPOSES ONLY
    // Use an actual secret key in production
    session({secret: process.env.PLAID_SECRET, saveUninitialized: true, resave: true}),
);

// Configuration for the Plaid client
const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
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
        user: {client_user_id: req.sessionID},
        client_name: 'eConomizer',
        language: 'en',
        products: ['auth','transactions','identity'],
        country_codes: ['US', 'IE'],
        android_package_name: process.env.PLAID_ANDROID_PACKAGE_NAME,
    };

    const tokenResponse = await client.linkTokenCreate(payload);
    res.json(tokenResponse.data.link_token);
    console.log("TOKEN ACQUIRED!!" + tokenResponse.data.link_token);
});

// Exchanges the public token from Plaid Link for an access token
app.post('/item/public_token/exchange', async (req, res ) => {
    console.log("Exchanging token for access token!!");
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    
    console.log("TOKEN EXCHANGED!!");
}); 
  
app.listen(PORT, () => {
console.log(`Server running on ${PORT}`);
});
