const functions = require('firebase-functions')
const admin = require('firebase-admin')

const serviceAccount = require('./survey-planet-app.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://survey-planet-app.firebaseio.com',
})
/* Initialise Firestore*/

const firestore = admin.firestore()
const auth = admin.auth()

firestore.settings({
  timestampsInSnapshots: true,
})

const { signUpFunc } = require('./src/auth/signup')

exports.signup = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    signUpFunc(request, response, firestore, auth)
  })
