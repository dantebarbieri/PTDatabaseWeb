import React from 'react'
import Week from '../../../model/Week'
import Event from '../../../model/Event'
import OfficeHour from './OfficeHour'

export default function OfficeHours(props:
	{
		isUserSignedIn: boolean
		officeHours?: Week
		updateOfficeHours: (week: Week) => void
	}
) {
	const { isUserSignedIn, officeHours, updateOfficeHours } = props

	const updateDay = (day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday") => {
		switch (day.toLowerCase()) {
			case 'monday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Monday = events
					updateOfficeHours(newHours)
				}
			}
			case 'tuesday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Tuesday = events
					updateOfficeHours(newHours)
				}
			}
			case 'wednesday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Wednesday = events
					updateOfficeHours(newHours)
				}
			}
			case 'thursday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Thursday = events
					updateOfficeHours(newHours)
				}
			}
			case 'friday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Friday = events
					updateOfficeHours(newHours)
				}
			}
			case 'saturday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Saturday = events
					updateOfficeHours(newHours)
				}
			}
			case 'sunday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = {...officeHours}
					newHours.Sunday = events
					updateOfficeHours(newHours)
				}
			}
			default: return () => {}
		}
	}

	return (
		<div className="OfficeHours">
			<h3>Office Hours</h3>
			{officeHours && <ul className="OfficeHoursList">
				<OfficeHour day='Monday' isUserSignedIn={isUserSignedIn} hours={officeHours.Monday} updateHours={updateDay('Monday')} />
				<OfficeHour day='Tuesday' isUserSignedIn={isUserSignedIn} hours={officeHours.Tuesday} updateHours={updateDay('Tuesday')} />
				<OfficeHour day='Wednesday' isUserSignedIn={isUserSignedIn} hours={officeHours.Wednesday} updateHours={updateDay('Wednesday')} />
				<OfficeHour day='Thursday' isUserSignedIn={isUserSignedIn} hours={officeHours.Thursday} updateHours={updateDay('Thursday')} />
				<OfficeHour day='Friday' isUserSignedIn={isUserSignedIn} hours={officeHours.Friday} updateHours={updateDay('Friday')} />
				<OfficeHour day='Saturday' isUserSignedIn={isUserSignedIn} hours={officeHours.Saturday} updateHours={updateDay('Saturday')} />
				<OfficeHour day='Sunday' isUserSignedIn={isUserSignedIn} hours={officeHours.Sunday} updateHours={updateDay('Sunday')} />
			</ul>}
		</div>
	)
}
