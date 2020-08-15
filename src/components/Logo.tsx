import React from 'react'
import '../styles/Fonts.scss'

export default function Logo() {
	return (
		<svg className="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
			<rect width="100%" height="100%" rx="10%" fill="#500000" />
			<text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="600" fontFamily="'PT Serif', serif">PT</text>
		</svg>
	)
}
