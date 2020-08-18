import React from 'react'
import { useDropzone } from 'react-dropzone'
import firebase from '../../firebase'
import schedule from '../../images/kmkeljadnmcmicjj.png'
import '../../styles/InputSchedule.scss'

export default function InputSchedule() {
	const onDrop = React.useCallback(acceptedFiles => {
		acceptedFiles.forEach((file: Blob) => {
			const reader = new FileReader()

			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				// Do whatever you want with the file contents
				const binaryStr = reader.result
				console.log(binaryStr)
			}
			reader.readAsArrayBuffer(file)
		})

	}, [])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
							Login to <a href="https://howdy.tamu.edu/">Howdy</a> and go to <a href="https://howdy.tamu.edu/uPortal/p/graphic-schedule-ui/max/render.uP">My Schedule</a>. You can find this on the row of quick links or under My Record &gt; My Schedule
						</li>
						<li>
							Click on the print button in the upper right of the graphic schedule (See the image below if you need help finding it).
							<img src={schedule} alt="schedule" />
						</li>
						<li>
							In the window that pops up, press Ctrl&#8288;/&#8288;Cmd&#8288;+&#8288;A to select all. Then press Ctrl&#8288;/&#8288;Cmd&#8288;-&#8288;C to copy.
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
					<label htmlFor="schedule">Schedule:</label><br />
					<textarea id="schedule"></textarea>
					<button>Submit Schedule</button>
				</div>
			</div>
		)
}
