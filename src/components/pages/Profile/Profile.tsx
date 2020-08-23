import React from 'react'
import firebase, { db } from '../../../firebase'
import '../../../styles/Profile.scss'
import OfficeHours from './OfficeHours'
import Week from '../../../model/Week'

export default function Profile(props:
	{
		userData: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null
		setUserData: React.Dispatch<React.SetStateAction<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null>>
	}
) {
	const { userData: signedInUser, setUserData: setSignedInUser } = props

	const params = new URLSearchParams(window.location.search)

	const uid = params.get('u')

	const [userData, setUserData] = React.useState<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>()

	React.useEffect(() => {
		if (signedInUser && signedInUser.id === uid) setUserData(signedInUser)
		else if (uid) db.collection('users').doc(uid).get()
			.then(doc => setUserData(doc))
			.catch(err => console.error(err))
	}, [signedInUser, uid])

	const updateOfficeHours = (officeHours: Week) => {
		if (signedInUser) {
			db.collection('users').doc(signedInUser.id).update({
				officeHours: officeHours
			})
				.then(() => {
					db.collection('users').doc(signedInUser.id).get()
						.then(doc => setSignedInUser(doc))
						.catch(err => console.error(err))
				})
				.catch(err => console.error(err))
		}
	}

	if (userData)
		return (
			<div className="Profile">
				<div className="Details">
					<img src={userData.data()?.photoUrl} alt={userData.data()?.name} />
					<div>
						<h1>{userData.data()?.name}</h1>
						<a href={`mailto:${userData.data()?.email}`}><h4>{userData.data()?.email}</h4></a>
						{userData.data()?.roles?.length && <p><strong>Roles: </strong>{userData.data()?.roles.sort()
							.map((role: string) => role.replace(/-+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
							.reduce((accumulator: string, current: string) => accumulator + ', ' + current)}</p>}
					</div>
				</div>
				<OfficeHours isUserSignedIn={userData === signedInUser} officeHours={userData.data()?.officeHours as Week} updateOfficeHours={updateOfficeHours} />
			</div>
		)
	else return (
		<div className="Profile">
			<h2>No User Matching that ID</h2>
		</div>
	)
}
