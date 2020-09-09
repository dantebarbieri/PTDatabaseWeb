import React from 'react'
import firebase, { db } from '../../../firebase'
import OfficeHours from './OfficeHours'
import Week from '../../../model/Week'
import Details from './Details'
import PossibleCourses from './PossibleCourses'
import CurrentCourses from './CurrentCourses'
import '../../../styles/Profile.scss'

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
				<div className="Sideways">
					<div>
						<Details user={userData.data()} />
						
					</div>
					{userData === signedInUser ?
						<PossibleCourses courses={userData.data()?.courses} uid={uid} setUserData={setSignedInUser} /> :
						<CurrentCourses courses={userData.data()?.courses} />}
				</div>
				<OfficeHours isUserSignedIn={userData === signedInUser} officeHours={userData.data()?.officeHours as Week} updateOfficeHours={updateOfficeHours} schedule={signedInUser?.data()?.schedule} />
			</div>
		)
	else return (
		<div className="Profile">
			<h2>No User Matching that ID</h2>
		</div>
	)
}
