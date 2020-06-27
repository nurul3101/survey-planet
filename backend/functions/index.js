const functions = require('firebase-functions')
const admin = require('firebase-admin')

/* Initialise Firestore*/
admin.initializeApp()

const firestore = admin.firestore()
firestore.settings({
  timestampsInSnapshots: true,
})

const { signUpFunc } = require('./src/auth/signup')

exports.signup = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    signUpFunc(request, response, firestore)
  })
