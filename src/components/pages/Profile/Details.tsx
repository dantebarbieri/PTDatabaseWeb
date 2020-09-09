import React from 'react'
import '../../../styles/Details.scss'

export default function Details(props:
	{user?: firebase.firestore.DocumentData}
) {
	const {user} = props

	return (
		<div className="Details">
			<img src={user?.photoUrl} alt={user?.name} />
			<div>
				<h1>{user?.name}</h1>
				<a href={`mailto:${user?.email}`}><h4>{user?.email}</h4></a>
				{user?.roles && user?.roles?.length !== 0 && <p><strong>Roles: </strong>{user?.roles.sort()
					.map((role: string) => role.replace(/-+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
					.reduce((accumulator: string, current: string) => accumulator + ', ' + current)}</p>}
			</div>

		</div>
	)
}
