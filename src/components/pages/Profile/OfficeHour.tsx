import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../../../firebase'
import Event from '../../../model/Event'
import MutableOfficeHour from './MutableOfficeHour'
import timestampCompare from '../../../model/TimestampCompare'
import '../../../styles/OfficeHour.scss'

export default function OfficeHour(props:
	{
		day: string
		isUserSignedIn: boolean
		hours: Event[]
		updateHours: (hours: Event[]) => void
	}
) {
	const { day, isUserSignedIn, hours, updateHours } = props

	const [localHours, setLocalHours] = React.useState<Array<Event>>(hours)

	const removeHour = (officeHour: Event) => setLocalHours(hours => hours.filter(hour => hour !== officeHour))

	const updateHour = (officeHour?: Event, index?: number) => {
		console.log(officeHour)
		if (officeHour) {
			console.log(officeHour.start.toDate(), officeHour.stop.toDate())
			console.log(localHours.filter(hour => hour !== officeHour && ((timestampCompare(officeHour.start, hour.start) > 0 && timestampCompare(officeHour.start, hour.stop) < 0) || (timestampCompare(officeHour.stop, hour.start) > 0 && timestampCompare(officeHour.stop, hour.stop) < 0))).length)
			if (index || index === 0) {
				setLocalHours(localHours => {
					localHours[index] = officeHour
					return localHours
				})
			} else {
				setLocalHours(localHours => localHours.concat(officeHour).sort((a, b) => timestampCompare(a.start, b.start)))
			}
		}
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
								<MutableOfficeHour key={uuidv4()} index={i++} conflicts={localHours.filter(hour => hour !== officeHour && ((timestampCompare(officeHour.start, hour.start) > 0 && timestampCompare(officeHour.start, hour.stop) < 0) || (timestampCompare(officeHour.stop, hour.start) > 0 && timestampCompare(officeHour.stop, hour.stop) < 0))).length} hour={officeHour} removeHour={removeHour} updateHour={updateHour} />
							)).concat((
								<li key={uuidv4()}>
									<button className="AddHoursButton" onClick={() => setLocalHours(hours => hours.concat({ start: firebase.firestore.Timestamp.now(), stop: firebase.firestore.Timestamp.now() }))}>Add Hours</button>
									{localHours !== hours && <button className="SaveHoursButton" onClick={() => updateHours(localHours)}>Save Hours</button>}
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
