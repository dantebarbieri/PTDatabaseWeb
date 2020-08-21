import React from 'react'
import firebase, { db } from '../../firebase'
import PT from '../PT'
import '../../styles/PTList.scss'

export default function PTList() {
	const [peerTeachers, setPeerTeachers] = React.useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]>();

	React.useEffect(() => {
		db.collection('users').where('roles', 'array-contains', 'peer-teacher').orderBy('lastName')
			.get()
			.then(querySnapshot => setPeerTeachers(querySnapshot.docs))
			.catch(error => console.error(error))
	}, [])

	return (
		<div className="PTList">
			{peerTeachers?.map(doc => <PT key={doc.id} data={doc.data()} />)}
		</div>
	)
}
