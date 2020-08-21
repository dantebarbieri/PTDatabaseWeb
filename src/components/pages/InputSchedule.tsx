import React from 'react'
import { useDropzone } from 'react-dropzone'
import ical from 'ical'
import firebase, { db } from '../../firebase'
import schedulePicture from '../../images/schedule.png'
import '../../styles/InputSchedule.scss'
import Week from '../../model/Week'
import ScheduleTable from '../ScheduleTable'

enum weekday {
	Monday = 0,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday
}

export default function InputSchedule(props:
	{ permissionToView: boolean }
) {
	const { permissionToView } = props

	const buttonRef = React.useRef<HTMLButtonElement>(null)
	const headerRef = React.useRef<HTMLHeadingElement>(null)

	const [schedule, setSchedule] = React.useState<{ [courseName: string]: Week }>()

	const onDrop = React.useCallback(acceptedFiles => {
		acceptedFiles.forEach((file: Blob) => {
			const reader = new FileReader()

			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				if (reader.result) {
					const calendar = ical.parseICS(reader.result as string)
					const s: { [courseName: string]: Week } = {}
					for (const key of Object.keys(calendar)) {
						const courseName = calendar[key].summary
						const calendarStart = calendar[key].start
						const calendarEnd = calendar[key].end
						if (courseName && calendarStart && calendarEnd) {
							const start = firebase.firestore.Timestamp.fromDate(calendarStart)
							const stop = firebase.firestore.Timestamp.fromDate(calendarEnd)
							if (!s[courseName])
								s[courseName] = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] }
							const days = calendar[key].rrule?.options.byweekday.map(day => weekday[day])
							if (days?.includes("Monday"))
								s[courseName].Monday.push({ start, stop })
							if (days?.includes("Tuesday"))
								s[courseName].Tuesday.push({ start, stop })
							if (days?.includes("Wednesday"))
								s[courseName].Wednesday.push({ start, stop })
							if (days?.includes("Thursday"))
								s[courseName].Thursday.push({ start, stop })
							if (days?.includes("Friday"))
								s[courseName].Friday.push({ start, stop })
							if (days?.includes("Saturday"))
								s[courseName].Saturday.push({ start, stop })
							if (days?.includes("Sunday"))
								s[courseName].Sunday.push({ start, stop })
						}
					}
					setSchedule(s)
				}
			}
			reader.readAsText(file)
		})

	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	if (!permissionToView)
		return (
			<h1>You must be signed in to view this page.</h1>
		)
	else
		return (
			<div className="InputSchedule">
				<div className="InputHandler">
					<div className="Instructions">
						<h2>Instructions</h2>
						<ol>
							<li>
								Login to <a href="https://howdy.tamu.edu/">Howdy</a> and go to <a href="https://howdy.tamu.edu/uPortal/p/graphic-schedule-ui/max/render.uP">My Schedule</a>. You can find this on the row of quick links or under My Record &gt; My Schedule
						</li>
							<li>
								Click on the download schedule button in the upper left of the graphic schedule (See the image below if you need help finding it).
							<img src={schedulePicture} alt="schedule" />
							</li>
							<li>
								Upload the file by dragging and dropping into the lighter region on the right, or click in the region and upload the file from file explorer.
						</li>
						</ol>
					</div>
					<div className="Input">
						<div className="DragNDrop" {...getRootProps()}>
							<input {...getInputProps()} />
							{
								isDragActive ?
									<p>Drop the files here ...</p> :
									<p>Drag 'n' drop some files here, or click to select files</p>
							}
						</div>
						<button ref={buttonRef} onClick={() => {
							if (window.confirm("This will write your schedule to the database. Are you sure that it is correct?")) {
								db.collection('users').doc(firebase.auth()?.currentUser?.uid).update({ schedule })
									.then(() => {
										if (headerRef.current) {
											headerRef.current.hidden = false
											headerRef.current.textContent = "Schedule Uploaded Successfully"
										}
										if (buttonRef.current)
											buttonRef.current.disabled = true
									})
									.catch(error => alert(`The commit was unable to be processed.\nError: ${error}`))
							}
						}}>Submit Schedule</button>
						<h3 ref={headerRef} hidden={true}>Upload Successful</h3>
					</div>
				</div>
				{schedule && <ScheduleTable schedule={schedule} />}
			</div>
		)
}
