import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
  apiKey: 'AIzaSyDivMlXIuHqDFsTCCqBDTVL0h29xbltcL8',
  authDomain: 'tests-firestore.firebaseapp.com',
  databaseURL: 'https://tests-firestore.firebaseio.com',
  projectId: 'tests-firestore',
  // storageBucket: 'tests-firestore.appspot.com',
  // messagingSenderId: '743555674736'
}
Firebase.initializeApp(config)
export const firebase = Firebase
export const firestore = Firebase.firestore()
