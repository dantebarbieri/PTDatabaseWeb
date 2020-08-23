import React from 'react'
import { useDropzone } from 'react-dropzone'
import firebase, { db } from '../../../firebase'
import Lab from '../../../model/Lab';
import LabsTable from './LabsTable';
import '../../../styles/InputLabs.scss'

export default function InputLabs(props:
	{ permissionToView: boolean }
) {
	const { permissionToView } = props

	let labsRef = React.useRef<HTMLTextAreaElement>(null)
	const onDrop = React.useCallback(acceptedFiles => {
		acceptedFiles.forEach((file: Blob) => {
			const reader = new FileReader()

			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				if (labsRef.current && typeof reader.result === 'string')
					labsRef.current.value = reader.result as string
			}
			reader.readAsText(file)
		})

	}, [labsRef])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	const [validLabs, setValidLabs] = React.useState<Array<number>>([])
	const [labsChanged, setLabsChanged] = React.useState<boolean>(false)
	const [labs, setLabs] = React.useState<Array<{ courseReferenceNumber: string, labData: Lab }>>()

	React.useEffect(() => {
		db.collection('valid-labs').doc('valid-labs').get()
			.then(doc => setValidLabs(doc.data()?.validLabs))
			.catch(error => alert(error))
	}, [])

	React.useEffect(() => {
		db.collection('labs').get()
			.then(querySnapshot => setLabs(querySnapshot.docs.map(doc => { return { courseReferenceNumber: doc.id, labData: doc.data() as Lab } })))
			.catch(error => alert(error))
		setLabsChanged(false)
	}, [])

	const addLabs = (text: string | null | undefined, validLabs: number[]): Array<{ courseReferenceNumber: string, labData: Lab }> => {
		const labsArray: Array<{ courseReferenceNumber: string, labData: Lab }> = []
		if (text) {
			let jsonData = JSON.parse(text);
			let labs = jsonData.data
			for (let lab of labs) {
				if (!validLabs.includes(lab.courseNumber)) continue
				const labData: Lab = {
					course: lab.courseNumber,
					section: lab.sequenceNumber,
					faculty: []
				}
				if (lab.faculty)
					labData.faculty = lab.faculty.map((faculty: any) => faculty.displayName)
				labData.times = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] }
				for (let meeting of lab.meetingsFaculty) {
					let meetingTime = meeting.meetingTime
					if (meetingTime.meetingType === 'LAB') {
						labData.building = meetingTime.building
						labData.room = meetingTime.room
						if (!meetingTime.beginTime || !meetingTime.endTime) break;
						const beginTime = firebase.firestore.Timestamp.fromDate(new Date(200, 1, 1, +meetingTime.beginTime.substring(0, 2), +meetingTime.beginTime.substring(2, 4), 0, 0))
						const endTime = firebase.firestore.Timestamp.fromDate(new Date(200, 1, 1, +meetingTime.endTime.substring(0, 2), +meetingTime.endTime.substring(2, 4), 0, 0))
						if (meetingTime.monday)
							labData.times.Monday.push({ start: beginTime, stop: endTime })
						if (meetingTime.tuesday)
							labData.times.Tuesday.push({ start: beginTime, stop: endTime })
						if (meetingTime.wednesday)
							labData.times.Wednesday.push({ start: beginTime, stop: endTime })
						if (meetingTime.thursday)
							labData.times.Thursday.push({ start: beginTime, stop: endTime })
						if (meetingTime.friday)
							labData.times.Friday.push({ start: beginTime, stop: endTime })
						if (meetingTime.saturday)
							labData.times.Saturday.push({ start: beginTime, stop: endTime })
						if (meetingTime.sunday)
							labData.times.Sunday.push({ start: beginTime, stop: endTime })
						break;
					}
				}
				labsArray.push({ courseReferenceNumber: lab.courseReferenceNumber, labData })
			}
		}
		return labsArray
	}

	if (!permissionToView)
		return (
			<h1>You must be signed in to view this page.</h1>
		)
	else
		return (
			<div className="InputLabs">
				<div className="InputHandler">
					<div className="Instructions">
						<h2>Instructions</h2>
						<ol>
							<li>
								Login to <a href="https://howdy.tamu.edu/">Howdy</a> and go to <a href="https://compassxe-ssb.tamu.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=authsearch">Class Search</a>. You can find this on the row of quick links or under My Record &gt; Search Class Schedule
						</li>
							<li>
								Select the current semester. Click Continue.
						</li>
							<li>
								Type CSCE as the subject. Use 110 as the lower course number range, and 316 as the higher course number. You should use the minimum and maximum course numbers serviced by the Peer Teacher program. Click Search.
						</li>
							<li>
								Open the <i>Developer Tools</i> by pressing Ctrl + Shift + I or F12 and navigate to the Network tab.
						</li>
							<li>
								At the bottom of the page, change the number of results per page to the maximum allowable value.
						</li>
							<li>
								If the XHR response does not appear in the network log, you will need to click the green Search Again and repeat from the second step.
						</li>
							<li>
								Copy the response of the request, it will be a lot and that is good. Then paste the response into the text box or save it to a file which you drag and drop in.
						</li>
							<li>
								Click <i>Submit Labs</i> to load the labs into the table below. This will also enable the <i>Commit Labs to Database</i> Button. This button acts almost like a "save" and without pressing it, any changes done locally are temporary. It is expensive to do too often, so only commit when you are sure that you are happy.
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
						<p>or</p>
						<label htmlFor="labs">Labs:</label><br />
						<textarea ref={labsRef} id="labs"></textarea>
						<button onClick={() => {
							setLabs(addLabs(labsRef.current?.value, validLabs))
							setLabsChanged(true)
						}}>Submit Labs</button>
						{labs && labsChanged && <button onClick={() => {
							if (window.confirm("Writing the labs to the database is non-trivial and if done too frequently can cause the app to stop functioning or cause Google to send us a bill. Are you sure you want to proceed?")) {
								const batch = db.batch()
								labs.map(lab => batch.set(db.collection('labs').doc(lab.courseReferenceNumber), lab.labData))
								batch.commit()
									.then(() => setLabsChanged(false))
									.catch(error => alert(`The commit was unable to be processed.\nError: ${error}`))
							}
						}}>Commit Labs to Database</button>}
					</div>
				</div>
				{labs && <LabsTable labs={labs} />}
			</div>
		)
}
