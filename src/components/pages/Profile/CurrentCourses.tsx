import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function CurrentCourses(props:
	{ courses?: Array<string> }
) {
	const { courses } = props

	return (
		<div className="CurrentCourses">
			<h2>Courses Can Peer Teach</h2>
			{courses !== undefined && <ul>
				{courses.map((str: string) => (
					<li key={uuidv4()}>{str}</li>
				))}
			</ul>}
		</div>
	)
}
