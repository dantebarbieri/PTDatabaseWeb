import React from 'react'
import { useDropzone } from 'react-dropzone'
import firebase from '../../firebase'
import Lab from '../../model/Lab';
import '../../styles/InputLabs.scss'

function addLabs(text: string | null | undefined, validLabs: number[]) {
	let newLabs: Array<Lab> = []
	if (text) {
		let jsonData = JSON.parse(text);
		let labs = jsonData.data
		for (let lab of labs) {
			if (!validLabs.includes(lab.courseNumber)) continue
			let newLab = new Lab(lab.courseNumber, lab.sequenceNumber)
			if (lab.instructionalMethod !== "Web Based") {
				for (let meeting of lab.meetingsFaculty) {
					let meetingTime = meeting.meetingTime
					if (meetingTime.meetingTypeDescription === "Laboratory") {
						newLab.days += meetingTime.monday ? "M" : ""
						newLab.days += meetingTime.tuesday ? "T" : ""
						newLab.days += meetingTime.wednesday ? "W" : ""
						newLab.days += meetingTime.thursday ? "R" : ""
						newLab.days += meetingTime.friday ? "F" : ""
						newLab.startTime = parseInt(meetingTime.beginTime)
						newLab.endTime = parseInt(meetingTime.endTime)
						break;
					}
				}
			}
			newLabs.push(newLab)
		}
	}
	return newLabs
}

export default function InputLabs() {
	let labsRef = React.createRef<HTMLTextAreaElement>()

	const onDrop = React.useCallback(acceptedFiles => {
		acceptedFiles.forEach((file: Blob) => {
			const reader = new FileReader()

			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				if (labsRef.current)
					labsRef.current.textContent = reader.result as string
			}
			reader.readAsText(file)
		})

	}, [labsRef])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	const [validLabs, setValidLabs] = React.useState<Array<number>>([])

	React.useEffect(() => {
		firebase.firestore().collection('Valid Labs').doc('EzUPl4oGMIHRJRWBPPmr').get()
			.then(doc => setValidLabs(doc.data()?.validLabs))
			.catch(error => alert(error))
	}, [])


	if (!firebase.auth().currentUser)
		return (
			<h1>You must be signed in to view this page.</h1>
		)
	else
		return (
			<div className="InputLabs">
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
							At the bottom of the page, change the number of results per page to the maximum allowable value.
						</li>
						<li>
							Press Ctrl&#8288;/&#8288;Cmd&#8288;+&#8288;A to select all. Then press Ctrl&#8288;/&#8288;Cmd&#8288;-&#8288;C to copy.
						</li>
						<li>
							Paste the clipboard into the text area on the right or into Notepad and then upload the file.
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
					<button onClick={() => console.log(addLabs(labsRef.current?.textContent, validLabs))}>Submit Labs</button>
				</div>
			</div>
		)
}
