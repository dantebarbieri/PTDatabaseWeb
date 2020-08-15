import firebase from 'firebase'
const config = {
	apiKey: "AIzaSyBt_0cpc7FLgngqLr5oGwVIljAGS22yRBQ",
  authDomain: "csce-pt-database-tamu.firebaseapp.com",
  databaseURL: "https://csce-pt-database-tamu.firebaseio.com",
  projectId: "csce-pt-database-tamu",
  storageBucket: "csce-pt-database-tamu.appspot.com",
  messagingSenderId: "941092727408",
  appId: "1:941092727408:web:e02eca0649325f32c2a2b5",
  measurementId: "G-V3L3H699HX"
};
firebase.initializeApp(config)
export default firebase