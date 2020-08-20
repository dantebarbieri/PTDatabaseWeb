import React from 'react'
import firebase from '../firebase'
import TAMULogo from "../images/Texas_A&M_University_logo.svg"
import '../styles/LoginButton.scss'

export default function LoginButton(props:
	{ setUser: (user: firebase.User) => void }
) {
	return (
		<span className="LoginButton">
			<button type="button" onClick={() => {
				let provider = new firebase.auth.GoogleAuthProvider()
				firebase.auth().useDeviceLanguage()
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
				firebase.auth().signInWithPopup(provider).then(result => {
					// The signed-in user info.
					let user = result.user
					if (user) {
						props.setUser(user)
						const docRef = firebase.firestore().collection('users').doc(user.uid)
						docRef.get()
						.then(doc => {
							if(!doc.exists) {
								const name = user?.displayName?.split(/[\s,]+/).filter(Boolean)
								let firstName: string | undefined
								let lastName: string | undefined
								if(name){
									firstName = name.shift()
									lastName = name.reduce((accumulator, currentValue) => accumulator + ' ' + currentValue)
								}
								docRef.set({
									name: user?.displayName,
									firstName: firstName,
									lastName: lastName,
									email: user?.email,
									photoUrl: user?.photoURL,
								})
							}
						})
						.catch(error => console.error(error))
					}
				}).catch(error => {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					// The email of the user's account used.
					var email = error.email;
					// // The firebase.auth.AuthCredential type that was used.
					// var credential = error.credential;
					alert(`${email} was unable to sign in. Error code: ${errorCode}\nReasaon: ${errorMessage}`)
				});
			}}>
				<div>
					<img width="18" height="18" src={TAMULogo} alt="TAMU Logo" />
				</div>
				<span>
					Sign in with CAS
				</span>
			</button>
		</span>
	)
}
