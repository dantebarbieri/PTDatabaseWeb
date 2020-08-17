import React from 'react'
import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'
import UserIcon from './UserIcon'
import firebase from '../firebase'
import 'bootstrap'
import '../styles/Navbar.scss'

export default function Navbar() {
	const [user, setUser] = React.useState<firebase.User>();

	React.useEffect(() => {
		let user = firebase.auth().currentUser
		if(user)
			setUser(user)
	})

	return (
		<div className="Navbar">
			<span className="Navbar-span">
				<img className="Navbar-logo" src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Texas_A%26M_University_logo.svg" alt="TAMU" />
				CSCE Peer Teaching
			</span>
			<span className="Navbar-links">
				<Link className="Navbar-link" to="/">Home</Link>
				<Link className="Navbar-link" to="/about">About</Link>
				{firebase.auth().currentUser && <Link className="Navbar-link" to="/input-schedule">Input Schedule</Link>}
			</span>
			{user ? <UserIcon userIcon={user.photoURL} /> : <LoginButton setUser={setUser} />}
		</div>
	)
}