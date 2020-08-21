import firebase from "firebase"

export default interface Event {
	start: firebase.firestore.Timestamp
	stop: firebase.firestore.Timestamp
}