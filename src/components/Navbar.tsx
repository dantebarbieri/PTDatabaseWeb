import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import LoginButton from './LoginButton'
import UserIcon from './UserIcon'
import firebase from '../firebase'
import 'bootstrap'
import '../styles/Navbar.scss'

export default function Navbar(props:
	{
		user: firebase.User | null
		setUser: (user: firebase.User) => void
	}
) {
	const {user, setUser} = props

	return (
		<div className="Navbar">
			<Link className="Navbar-link" to="/">
				<span className="Navbar-span">
					<img className="Navbar-logo" src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Texas_A%26M_University_logo.svg" alt="TAMU" />
					CSCE Peer Teaching
				</span>
			</Link>
			<span className="Navbar-links">
				<NavLink exact className="Navbar-link" activeClassName="active" to="/">Home</NavLink>
				<NavLink  className="Navbar-link" activeClassName="active" to="/about">About</NavLink>
				{user && <NavLink  className="Navbar-link" activeClassName="active" to="/input-schedule">Input Schedule</NavLink>}
				{user && <NavLink  className="Navbar-link" activeClassName="active" to="/input-labs">Input Labs</NavLink>}
			</span>
			{user ? <UserIcon userIcon={user.photoURL} /> : <LoginButton setUser={setUser} />}
		</div>
	)
}