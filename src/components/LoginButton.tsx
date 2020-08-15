import React from 'react'
import firebase from '../firebase'
import GoogleLogin from 'react-google-login'
import '../styles/LoginButton.scss'

export default function LoginButton() {
	return (
		<span className="LoginButton">
			<GoogleLogin clientId="941092727408-ba0psssbfeod6hn4mjauqltosmsk38gd.apps.googleusercontent.com"/>
		</span>
	)
}
