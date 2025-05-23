# Code Assistant Set-Up
This program is a proof of concept for an AI-Powered coding assistant for introductory students. Rather than outright offering a fixed version of code for the user, the OpenAI API is instructed to select three errors to explain in depth. Once code is submitted, the following information will be provided for each error:
1. A brief description of the error
2. An explanation of the error: what is at fault, how this error might negatively impact their program
3. Feedback on fixing the error 

Many thanks to Professor Jim Skon for his assistance. 
## Prerequisites
Before starting, make sure you have:
  - Node.js and npm installed
```
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
```
  - An OpenAI API key (you can sign up on OpenAI’s website to obtain one)
  - Basic familiarity with JavaScript, HTML, and Node.js

## Initialize a Node.js Project
  - Initialize your project with npm:
```
     npm init -y
```
## Install Dependencies
  - Install Express (to set up a simple server), dotenv (for environment variables), and axios (for HTTP requests, although you could also use node-fetch):
```
     npm install openai
     npm install express dotenv axios
```
Note: You can also use the official OpenAI SDK if preferred.
##  .env
You need an `.env` in the directory.  It must have:
```
DB_HOST=localhost
DB_USER=Win10Diag
DB_PASS=Kenyon1824Diag
DB_NAME=diagnostics
PORT=3001
OPENAI_API_KEY=youropenaikey
```

## Get an OpenAI API Key
1. Create an OpenAI Account
Visit: https://platform.openai.com/signup
    - Sign up using your email address, or continue with Google, Microsoft, or Apple.
    - Verify your email and phone number if prompted.

2. Log in to the OpenAI Platform
    - Go to: https://platform.openai.com/
    - Use your credentials to log in.

3. Set Up Billing
    - If you are using GPT-4 or other paid models, you must set up billing.
    - Navigate to https://platform.openai.com/account/billing/overview
    - Click “Set up paid account” and enter a valid credit card.
    - You will be charged based on usage, not a flat fee unless you choose a subscription like ChatGPT Plus (for web use only).

## To run
`node server.js`

## To use 
Paste code into the textbox. 

## Customization 
If you would like to change the token limit, the variable max_tokens may be found in server.js under const response. If the prompt requires adjusting, edit the content of role: "system" located under const messages, also located in server.js. 
