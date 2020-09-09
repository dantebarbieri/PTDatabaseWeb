import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import Event from '../../../model/Event'
import '../../../styles/OfficeHour.scss'

export default function DailyCourseSchedule(props:
	{
		day: string
		courses: {label: string, event: Event}[]
	}
) {
	const { day, courses } = props

	return (
		<>
			{courses.length !== 0 && <li className="DailyCourseSchedule">
				<strong>{day}</strong>
				<ul className="Meetings">
					{courses.map(course => (
							<li key={uuidv4()}><i>{course.label}</i>: {course.event.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {course.event.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
						))
					}
				</ul>
			</li>}
		</>
	)
}
