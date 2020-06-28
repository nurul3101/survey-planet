import firebase from 'firebase'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'survey-planet-app.firebaseapp.com',
  databaseURL: 'https://survey-planet-app.firebaseio.com',
  projectId: 'survey-planet-app',
  storageBucket: 'survey-planet-app.appspot.com',
  messagingSenderId: '284719831927',
  appId: '1:284719831927:web:b56c0a3a45d7364fee1f72',
  measurementId: 'G-ML4XH570TP',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
