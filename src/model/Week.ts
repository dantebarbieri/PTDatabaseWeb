import firebase from "firebase"
import Event from './Event'

export default interface Week {
	Monday: Array<Event>
	Tuesday: Array<Event>
	Wednesday: Array<Event>
	Thursday: Array<Event>
	Friday: Array<Event>
	Saturday: Array<Event>
	Sunday: Array<Event>
}