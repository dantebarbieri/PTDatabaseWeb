import React from 'react'
import firebase from '../../../firebase'
import Event from '../../../model/Event'
import timestampCompare from '../../../model/TimestampCompare'

export default function Mutablehour(props:
	{
		conflicts: number
		hour: Event
		index?: number
		removeHour: (hour: Event) => void
		updateHour: (hours?: Event, index?: number) => void
	}
) {
	const { conflicts, hour, index, removeHour, updateHour } = props

	const startRef = React.useRef<HTMLInputElement>(null)
	const stopRef = React.useRef<HTMLInputElement>(null)

	const stringToDate = (time: string): Date => {
		const pm = time.toLowerCase().includes('pm')
		const parts = time.split(/[\s:.]/g)
		return new Date(2000, 1, 1, +parts[0] + (pm ? 12 : 0), +parts[1])
	}

	const createEvent = (start?: string, stop?: string) => {
		if(start && stop) {
			return {
				start: firebase.firestore.Timestamp.fromDate(stringToDate(start)),
				stop: firebase.firestore.Timestamp.fromDate(stringToDate(stop))
			}
		}
	}

	return (
		<li onBlur={() => updateHour(createEvent(startRef.current?.value, stopRef.current?.value), index)} className={`MutableOfficeHour ${conflicts || timestampCompare(hour.start, hour.stop) > 0 ? 'invalid' : ''}`}>
			{conflicts !== 0 && <p>{conflicts} Conflict{conflicts !== 1 && 's'}</p>}
			<input ref={startRef} defaultValue={hour.start.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} />
									&ndash;
			<input ref={stopRef} defaultValue={hour.stop.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} />
			<button className="RemoveHoursButton" onClick={() => removeHour(hour)}>Remove Hours</button>
		</li>
	)
}
