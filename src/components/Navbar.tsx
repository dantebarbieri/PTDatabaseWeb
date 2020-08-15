import React from 'react'
import LoginButton from './LoginButton'
import '../styles/Navbar.scss'

export default function Navbar() {
	return (
		<div className="Navbar">
			<span className="Navbar-span">
				<img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Texas_A%26M_University_logo.svg" alt="TAMU" />
				CSCE Peer Teaching
			</span>
			<LoginButton />
		</div>
	)
}