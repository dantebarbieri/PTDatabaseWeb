import React from 'react'
import Week from '../../../model/Week'
import Event from '../../../model/Event'
import OfficeHour from './OfficeHour'
import DailyCourseSchedule from './DailyCourseSchedule'
import timestampCompare from '../../../model/TimestampCompare'
import MutableGuide from './MutableGuide'
import '../../../styles/OfficeHours.scss'

export default function OfficeHours(props:
	{
		isUserSignedIn: boolean
		officeHours?: Week
		updateOfficeHours: (week: Week) => void
		schedule?: { [courseName: string]: Week }
	}
) {
	const { isUserSignedIn, officeHours, updateOfficeHours, schedule } = props

	const updateDay = (day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday") => {
		switch (day.toLowerCase()) {
			case 'monday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Monday = events
					updateOfficeHours(newHours)
				}
			}
			case 'tuesday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Tuesday = events
					updateOfficeHours(newHours)
				}
			}
			case 'wednesday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Wednesday = events
					updateOfficeHours(newHours)
				}
			}
			case 'thursday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Thursday = events
					updateOfficeHours(newHours)
				}
			}
			case 'friday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Friday = events
					updateOfficeHours(newHours)
				}
			}
			case 'saturday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Saturday = events
					updateOfficeHours(newHours)
				}
			}
			case 'sunday': return (events: Event[]) => {
				if (officeHours) {
					const newHours: Week = { ...officeHours }
					newHours.Sunday = events
					updateOfficeHours(newHours)
				}
			}
			default: return () => { }
		}
	}

	const courses: {
		Monday: { label: string, event: Event }[]
		Tuesday: { label: string, event: Event }[]
		Wednesday: { label: string, event: Event }[]
		Thursday: { label: string, event: Event }[]
		Friday: { label: string, event: Event }[]
		Saturday: { label: string, event: Event }[]
		Sunday: { label: string, event: Event }[]
	} = {
		Monday: [],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: [],
		Saturday: [],
		Sunday: []
	};

	if (schedule)
		for (const key of Object.keys(schedule)) {
			courses.Monday = courses.Monday.concat(schedule[key].Monday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Tuesday = courses.Tuesday.concat(schedule[key].Tuesday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Wednesday = courses.Wednesday.concat(schedule[key].Wednesday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Thursday = courses.Thursday.concat(schedule[key].Thursday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Friday = courses.Friday.concat(schedule[key].Friday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Saturday = courses.Saturday.concat(schedule[key].Saturday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
			courses.Sunday = courses.Sunday.concat(schedule[key].Sunday.map(event => { return { label: key, event } })).sort((a, b) => timestampCompare(a.event.start, b.event.start))
		}

	return (
		<div className="OfficeHours">
			<h3>Office Hours</h3>
			<div className={isUserSignedIn ? 'Sideways' : ''}>
				<div>
					{officeHours && <ul className="OfficeHoursList">
						<OfficeHour day='Monday' isUserSignedIn={isUserSignedIn} hours={officeHours.Monday} updateHours={updateDay('Monday')} courses={courses.Monday} />
						<OfficeHour day='Tuesday' isUserSignedIn={isUserSignedIn} hours={officeHours.Tuesday} updateHours={updateDay('Tuesday')} courses={courses.Tuesday} />
						<OfficeHour day='Wednesday' isUserSignedIn={isUserSignedIn} hours={officeHours.Wednesday} updateHours={updateDay('Wednesday')} courses={courses.Wednesday} />
						<OfficeHour day='Thursday' isUserSignedIn={isUserSignedIn} hours={officeHours.Thursday} updateHours={updateDay('Thursday')} courses={courses.Thursday} />
						<OfficeHour day='Friday' isUserSignedIn={isUserSignedIn} hours={officeHours.Friday} updateHours={updateDay('Friday')} courses={courses.Friday} />
						<OfficeHour day='Saturday' isUserSignedIn={isUserSignedIn} hours={officeHours.Saturday} updateHours={updateDay('Saturday')} courses={courses.Saturday} />
						<OfficeHour day='Sunday' isUserSignedIn={isUserSignedIn} hours={officeHours.Sunday} updateHours={updateDay('Sunday')} courses={courses.Sunday} />
					</ul>}
				</div>
				{isUserSignedIn && schedule && <div className="CourseSchedule">
					<h4>Course Schedule</h4>
					<ul className="CourseScheduleList">
						<DailyCourseSchedule day='Monday' courses={courses.Monday} />
						<DailyCourseSchedule day='Tuesday' courses={courses.Tuesday} />
						<DailyCourseSchedule day='Wednesday' courses={courses.Wednesday} />
						<DailyCourseSchedule day='Thursday' courses={courses.Thursday} />
						<DailyCourseSchedule day='Friday' courses={courses.Friday} />
						<DailyCourseSchedule day='Saturday' courses={courses.Saturday} />
						<DailyCourseSchedule day='Sunday' courses={courses.Sunday} />
					</ul>
					{isUserSignedIn && <MutableGuide />}
				</div>
				}
			</div>
		</div>
	)
}
