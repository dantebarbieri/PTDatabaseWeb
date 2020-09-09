import React from 'react'
import '../../../styles/MutableGuide.scss'

export default function MutableGuide() {
	return (
		<div className="MutableGuide">
			<p className="invalid">Invalid - Possibly Starts before Stops or Has a Conflict with another Office Hour</p>
			<p className="course-invalid">Course Invalid - Conflicts with a course on your schedule</p>
			<p className="changed">Changed - To confirm changes, press Save Hours</p>
		</div>
	)
}
