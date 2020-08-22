import React from 'react'
import firebase, { db } from '../../firebase'
import { v4 as uuidv4 } from 'uuid'
import Event from '../../model/Event'
import '../../styles/Profile.scss'

export default function Profile(props:
	{ userData: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null }
) {
	const { userData: signedInUser } = props

	const params = new URLSearchParams(window.location.search)

	const uid = params.get('u')

	const [userData, setUserData] = React.useState<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>()

	React.useEffect(() => {
		if (signedInUser && signedInUser.id === uid) setUserData(signedInUser)
		else if (uid) db.collection('users').doc(uid).get()
			.then(doc => setUserData(doc))
			.catch(err => console.error(err))
	}, [signedInUser, uid])

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
				<h3>Office Hours</h3>
				{userData.data()?.officeHours && <ul className="OfficeHours">
					{(userData.data()?.officeHours.Monday.length || userData === signedInUser) && <li>
						<strong>Monday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								(
									userData.data()?.officeHours.Monday.map((officeHour: Event) => (<li><input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} /></li>))
										.push((<>
											<li><input /></li>
											<li><button>Add Times</button></li>
										</>))) :
								userData.data()?.officeHours.Monday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Tuesday.length || userData === signedInUser) && <li>
						<strong>Tuesday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Tuesday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Tuesday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Wednesday.length || userData === signedInUser) && <li>
						<strong>Wednesday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Wednesday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Wednesday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Thursday.length || userData === signedInUser) && <li>
						<strong>Thursday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Thursday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Thursday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Friday.length || userData === signedInUser) && <li>
						<strong>Friday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Friday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Friday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Saturday.length || userData === signedInUser) && <li>
						<strong>Saturday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Saturday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Saturday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
					{(userData.data()?.officeHours.Sunday.length || userData === signedInUser) && <li>
						<strong>Sunday</strong>
						<ul className="Meetings">
							{userData === signedInUser ?
								userData.data()?.officeHours.Sunday.map((officeHour: Event) => (<input key={uuidv4()} value={`${officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />)) :
								userData.data()?.officeHours.Sunday.map((officeHour: Event) => (<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>))
							}
						</ul>
					</li>}
				</ul>}
			</div>
		)
	else return (
		<div className="Profile">
			<h2>No User Matching that ID</h2>
		</div>
	)
}
