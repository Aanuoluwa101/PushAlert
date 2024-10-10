// import { App } from 'octokit';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import { createNodeMiddleware } from "@octokit/webhooks";
// import http from 'http';
// import path from 'path';


// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Load environment variables
// dotenv.config();

// // Assign environment variables
// const appId = process.env.APP_ID;
// const privateKeyPath = process.env.PRIVATE_KEY_PATH;
// const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
// const webhookSecret = process.env.WEBHOOK_SECRET;

// // Initialize Octokit App
// const app = new App({
//     appId,
//     privateKey,
//     webhooks: {
//         secret: webhookSecret,
//     },
// });

// // Utility to print values
// const printValue = (object) => {
//     if (object === null) {
//         console.log("null");
//         return;
//     }
//     if (typeof object === "string") {
//         console.log(object);
//     } else {
//         Object.entries(object).forEach(([key, value]) => {
//             console.log(`${key}: ${value}`);
//         });
//     }
// };

// async function handlePR({ octokit, payload }) {
//     console.log("Payload received:", payload);

//     Object.entries(payload).forEach(([key, value]) => {
//         console.log(`${key}:`);
//         printValue(value);
//     });

//     const logfilePath = path.join(__dirname, 'PR.json');
//     const data = JSON.stringify(payload, null, 2);

//     fs.writeFile(logfilePath, data, (err) => {
//         if (err) {
//             console.error(`Error writing to log file: ${err}`);
//         } else {
//             console.log("Logging successful");
//         }
//     });
// }

// // Listen for push events
// app.webhooks.on('pull_request.opened', handlePR);

// // Handle webhook errors
// app.webhooks.onError((error) => {
//     if (error.name === "AggregateError") {
//         console.error(`Error processing request: ${error.event}`);
//     } else {
//         console.error(error);
//     }
// });

// // Define server parameters
// con/**
//  * GitHub App Webhook Handler
//  * 
//  * This module sets up a GitHub App using Octokit to handle webhook events,
//  * specifically for pull request operations. It performs the following tasks:
//  * 
//  * 1. Loads environment variables for app configuration.
//  * 2. Initializes the GitHub App with the provided credentials.
//  * 3. Defines a handler for 'pull_request.opened' events.
//  * 4. Logs received payload data to a JSON file for debugging.
//  * 5. Sets up error handling for webhook processing.
//  * 6. Configures and starts a local server to receive webhook events.
//  * 
//  * The app listens on localhost:3000 and uses the '/api/webhook' endpoint
//  * for incoming GitHub webhook events.
//  * 
//  * Dependencies:
//  * - octokit
//  * - dotenv
//  * - fs
//  * - http
//  * - path
//  * 
//  * Environment variables required:
//  * - APP_ID: The GitHub App ID
//  * - PRIVATE_KEY_PATH: Path to the private key file for the GitHub App
//  * - WEBHOOK_SECRET: Secret for verifying webhook payloads
//  */

// import { App } from 'octokit';
// import dotenv from 'dotenv';
// // ... rest of the existing codest port = 3000;
// const host = 'localhost';
// const pathUrl = "/api/webhook";
// const localWebhookUrl = `http://${host}:${port}${pathUrl}`;

// // Create Node.js middleware for handling webhook events
// const middleware = createNodeMiddleware(app.webhooks, { path: pathUrl });

// // Start the server
// http.createServer(middleware).listen(port, () => {
//     console.log(`Server is listening for events at: ${localWebhookUrl}`);
//     console.log('Press Ctrl + C to quit.');
// });







import express from 'express' ;
import axios from 'axios';
import dotenv from 'dotenv';
import url from 'url';  
import crypto from 'crypto'

dotenv.config();

const app = express();  

const CLIENT_ID = process.env.CLIENT_ID; // Replace with your GitHub App's client ID  
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Replace with your GitHub App's client secret  
const REDIRECT_URI = 'https://pushalert.onrender.com/callback'; // Replace with your app's callback URL  




function generateTempToken() {
    return crypto.randomBytes(16).toString('hex');
}




// app.get('/temptoken', extractUserId, (req, res) => {
//     const userId = req.userId;
//     const tempToken = generateTempToken();
    
// })

app.get('/setup', (req, res) => {  
  const { state, installation_id } = req.query;  

  const authorizationUrl = 'https://github.com/login/oauth/authorize';  
  const params = {  
    client_id: CLIENT_ID,  
    redirect_uri: REDIRECT_URI,  
    state: state,  
    // Additional parameters can be added here, e.g., login, allow_signup, prompt  
  };  

  const decodedState = JSON.parse(decodeURIComponent(state));
  
  console.log(`state: ${JSON.stringify(decodedState, null, 2)}`)
  console.log(`installation_id: ${installation_id}`)

  //add the installation_id field to the temp-token

  const authorizeUrl = `${authorizationUrl}?${new URLSearchParams(params).toString()}`;  
  res.redirect(authorizeUrl);  
});  

app.get('/github-auth-callback', async (req, res) => {  
  const { code, state } = req.query;  

  // Verify the state parameter  
  if (!state) { 
    return res.status(400).send('Invalid state parameter');  
  }

  const decodedState = JSON.parse(decodeURIComponent(state));
  console.log(`state in github-auth-callback: ${JSON.stringify(decodedState, null, 2)}`)


  try {  
    const tokenUrl = 'https://github.com/login/oauth/access_token';  
    const response = await axios.post(tokenUrl, {  
      client_id: CLIENT_ID,  
      client_secret: CLIENT_SECRET,  
      code,  
      redirect_uri: 'https://aanuoluwapoayodeji.onrender.com/',  
      // Additional parameters can be added here, e.g., repository_id  
    }, {  
      headers: {  
        'Accept': 'application/json'  
      }  
    });  

    const { access_token } = response.data;  
    console.log('Access Token:', access_token);  

    // using decodedState.tempToken, get the installation_id
    // use the access_token to confirm the installation_id
    // then use the token to find the user and associate the installation id and
    // other things with that user 

    res.send(`Access Token: ${access_token}`);  
  } catch (error) {  
    console.error(error);  
    res.status(500).send('Error obtaining access token');  
  }  
});  

app.listen(3000, () => {  
  console.log('Server is running on port 3000');  
});


// const parsedUrl = url.parse(req.url, true);  
// const queryParams = parsedUrl.query;  

//   // Convert the query parameters to JSON and print it  
// console.log(JSON.stringify(queryParams, null, 2)); 