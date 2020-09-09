import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../../../firebase'
import Event from '../../../model/Event'
import MutableOfficeHour from './MutableOfficeHour'
import timestampCompare from '../../../model/TimestampCompare'
import '../../../styles/OfficeHour.scss'

function timeConflict(a: Event, b: Event): boolean {
	return ((timestampCompare(a.start, b.start) > 0 && timestampCompare(a.start, b.stop) < 0) || (timestampCompare(a.stop, b.start) > 0 && timestampCompare(a.stop, b.stop) < 0) || (timestampCompare(a.start, b.start) < 0 && timestampCompare(a.stop, b.stop) > 0))
}

export default function OfficeHour(props:
	{
		day: string
		isUserSignedIn: boolean
		hours: Event[]
		updateHours: (hours: Event[]) => void
		courses?: {label: string, event: Event}[]
	}
) {
	const { day, isUserSignedIn, hours, updateHours, courses } = props

	const [changed, setChanged] = React.useState<boolean>(false);

	const [localHours, setLocalHours] = React.useState<Array<Event>>(hours)

	const removeHour = (officeHour: Event) => setLocalHours(hours => hours.filter(hour => hour !== officeHour))

	const updateHour = (officeHour?: Event, index?: number) => {
		if (officeHour) {
			setChanged(true);
			if (index || index === 0) {
				return setLocalHours(localHours => localHours.filter(hours => hours !== localHours[index]).concat(officeHour).sort((a, b) => timestampCompare(a.start, b.start)))
			} else {
				return setLocalHours(localHours => localHours.concat(officeHour).sort((a, b) => timestampCompare(a.start, b.start)))
			}
		}
	}

	const countCourseConflicts = (officeHour: Event): number => {
		if(!courses) return 0
		else return courses.filter(course => timeConflict(officeHour, course.event)).length
	}

	let i = 0

	return (
		<>
			{(hours.length || isUserSignedIn) && <li className="OfficeHour">
				<strong>{day}</strong>
				<ul className="Meetings">
					{isUserSignedIn ?
						(
							localHours.map(officeHour => (
								<MutableOfficeHour key={uuidv4()} index={i++} conflicts={localHours.filter(hour => hour !== officeHour && timeConflict(officeHour, hour)).length} courseConflicts={countCourseConflicts(officeHour)} hour={officeHour} removeHour={removeHour} updateHour={updateHour} />
							)).concat((
								<li key={uuidv4()}>
									<button className="AddHoursButton" onClick={() => {
										setChanged(true);
										return setLocalHours(hours => hours.concat({ start: firebase.firestore.Timestamp.now(), stop: firebase.firestore.Timestamp.now() }))
									}}>Add Hours</button>
									{localHours !== hours && <button className={`SaveHoursButton${changed ? ' changed' : ''}`} onClick={() => {
										setChanged(false);
										return updateHours(localHours)
									}}>Save Hours</button>}
								</li>))
						) :
						hours.map((officeHour: Event) => (
							<li key={uuidv4()}>{officeHour.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash; {officeHour.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
						))
					}
				</ul>
			</li>}
		</>
	)
}
