import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase, { db } from '../../../firebase'
import '../../../styles/PossibleCourses.scss'

export default function PossibleCourses(props:
	{
		courses?: Array<string>
		setUserData: React.Dispatch<React.SetStateAction<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null>>
		uid: string | null
	}
) {
	const { courses, setUserData, uid } = props

	const [possibleCourses, setPossibleCourses] = React.useState<Array<[string, boolean, boolean]>>([]);

	React.useEffect(() => {
		db.collection('valid-labs').doc('valid-labs').get()
			.then(doc => {
					const possible: Array<[string, boolean, boolean]> = []
					if (courses) {
					for (const course of doc.data()?.validLabs) {
						const included: boolean = courses.includes(course)
						possible.push([course, included, included])
					}
				} else {
					for (const course of doc.data()?.validLabs) {
						possible.push([course, false, false])
					}
				}
				return setPossibleCourses(possible)
			})
			.catch(err => console.error(err))
	}, [courses])

	return (
		<div className="PossibleCourses">
			<h2>Select Courses You Can Peer Teach</h2>
			<ul>
				{possibleCourses.map(course => (
					<li key={uuidv4()}>
						<label>
							<input type="checkbox" checked={course[1]} onChange={() => setPossibleCourses(pc => pc.filter(c => c[0] !== course[0]).concat([[course[0], !course[1], course[2]]]).sort((a, b) => a[0].localeCompare(b[0])))} />
							{course[0]}
						</label>
					</li>
				))}
			</ul>
			{uid && possibleCourses.filter(course => course[1] !== course[2]).length !== 0 && <button onClick={async () => {
				const courses: Array<string> = []
				for (let i = 0; i < possibleCourses.length; ++i)
					if (possibleCourses[i][1])
						courses.push(possibleCourses[i][0])
				return db.collection('users').doc(uid).update({
					courses: courses
				})
				.then(() => {
					db.collection('users').doc(uid).get()
						.then(doc => setUserData(doc))
						.catch(error => console.error(error))
				})
				.catch(err => console.error(err))
			}}>Update Courses</button>}
		</div>
	)
}

/*
{userData.data()?.labs && userData.data()?.labs.length !== 0 &&
						<div>
							<h2>Labs</h2>
						</div>
					}
					{signedInUser === userData ?
						userData.data()?.courses && userData.data()?.courses.length !== 0 &&
						<div>
							<h2>Courses Can Peer Teach</h2>
							<ul>
								{possibleCourses.map(str => (
									<li key={uuidv4()}>
										<label htmlFor={str}>
											<input type="checkbox" id={str} name={str} defaultChecked={userData.data()?.courses.includes(str)} />
											{str}
										</label>
									</li>
								))}
							</ul>
							{signedInUser && signedInUser.id === uid && teachableCourses !== initialTeachableCourses && <button onClick={async () => {
								const courses = []
								for(let i = 0; i < possibleCourses.length; ++i)
									if(teachableCourses[i])
										courses.push(possibleCourses[i])
								return db.collection('users').doc(uid).update({
									courses: courses
								}).catch(err => console.error(err))
						}}>Update Courses</button>}
						</div>
						:
						userData.data()?.courses && userData.data()?.courses.length !== 0 &&
						<div>
							<h2>Courses Can Peer Teach</h2>
							<ul>
								{userData.data()?.courses.map((str: string) => (
									<li key={uuidv4()}>{str}</li>
								))}
							</ul>
						</div>}
*/