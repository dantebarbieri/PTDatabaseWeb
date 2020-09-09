import React from 'react'
import firebase from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import Week from '../model/Week'
import Event from '../model/Event'
import timestampCompare from '../model/TimestampCompare'
import '../styles/PT.scss'

function timeToListItem(day: string, times: Array<Event>): JSX.Element {
	return (
		<li> {day}
			<ul>
				{times.sort((t1, t2) => timestampCompare(t1.start, t2.start)).map(time => (
					<li key={uuidv4()}>{time.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {time.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
				))}
			</ul>
		</li>
	)
}

export default function PT(props:
	{
		data: firebase.firestore.DocumentData
	}
) {
	const { data } = props

	const week: Week = data.officeHours

	React.useEffect(() => {
		console.log(data.courses)
		console.log(data.officeHours)
	}, [data.courses, data.officeHours])

	return (
		<div className="PT">
			<hr />
			<img alt={data.name} height="125" src={data.photoUrl} width="85" style={{ objectFit: "cover" }} />
			<h3>{data.name} | <a href={`mailto:${data.email}`}>Email</a></h3>
			<div className="Sideways">
				<div>
					<p><strong>Courses:</strong></p>
					<ul>
						TODO Automate Course List
					<li>CSCE 206</li>
						<li>CSCE 121</li>
						<li>CSCE 221</li>
					</ul>
				</div>
				<div>
					<p><strong>Courses Can Peer Teach:</strong></p>
					{data.courses &&
						<ul>
							{data.courses.map((course: string) => <li>{course}</li>)}
						</ul>
					}
				</div>
			</div>
			<p><strong>Office Hours:</strong></p>
			{week && <ul>
				{week.Monday.length !== 0 && timeToListItem("Monday", data.officeHours.Monday)}
				{week.Tuesday.length !== 0 && timeToListItem("Tuesday", data.officeHours.Tuesday)}
				{week.Wednesday.length !== 0 && timeToListItem("Wednesday", data.officeHours.Wednesday)}
				{week.Thursday.length !== 0 && timeToListItem("Thursday", data.officeHours.Thursday)}
				{week.Friday.length !== 0 && timeToListItem("Friday", data.officeHours.Friday)}
				{week.Saturday.length !== 0 && timeToListItem("Saturday", data.officeHours.Saturday)}
				{week.Sunday.length !== 0 && timeToListItem("Sunday", data.officeHours.Sunday)}
			</ul>}
		</div>
	)
}
