const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')

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
const { fetchUserInfoFunc } = require('./src/dashboard/fetchUserInfo')
const { createNewSurveyFunc } = require('./src/coordinator/createNewSurvey')
const {
  fetchCoordinatorSurveysFunc,
} = require('./src/coordinator/fetchCoordinatorSurveys')
const { getSurveyFeedFunc } = require('./src/respondent/getSurveyFeed')
const { submitSurveyFunc } = require('./src/respondent/submitSurvey')
const {
  getRespondentSurveysFunc,
} = require('./src/respondent/getRespondentSurveys')
const {
  fetchResponsesToSurveysFunc,
} = require('./src/coordinator/fetchResponsesToSurveys')

exports.signup = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      signUpFunc(request, response, firestore, auth)
    })
  })

exports.fetchUserInfo = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      fetchUserInfoFunc(request, response, firestore)
    })
  })

exports.createNewSurvey = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      createNewSurveyFunc(request, response, firestore)
    })
  })

exports.fetchCoordinatorSurveys = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      fetchCoordinatorSurveysFunc(request, response, firestore)
    })
  })

exports.getSurveyFeed = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      getSurveyFeedFunc(request, response, firestore)
    })
  })

exports.submitSurvey = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      submitSurveyFunc(request, response, firestore)
    })
  })

exports.getRespondentSurveys = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      getRespondentSurveysFunc(request, response, firestore)
    })
  })

exports.fetchResponsesToSurveys = functions
  .runWith({ timeoutSeconds: 60, memory: '1GB' })
  .https.onRequest((request, response) => {
    var corsFn = cors({ origin: true })
    corsFn(request, response, () => {
      fetchResponsesToSurveysFunc(request, response, firestore)
    })
  })
