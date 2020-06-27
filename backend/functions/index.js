const functions = require('firebase-functions')

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const { signUpFunc } = require('./src/auth/signup')

exports.signup = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    signUpFunc(request, response)
  })
