import React from 'react'
import { useDropzone } from 'react-dropzone'
import firebase from '../../firebase'
import '../../styles/InputLabs.scss'

export default function InputLabs() {
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
					<textarea id="labs"></textarea>
					<button>Submit Labs</button>
				</div>
			</div>
		)
}
