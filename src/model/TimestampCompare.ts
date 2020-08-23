export default function timestampCompare(a: firebase.firestore.Timestamp, b: firebase.firestore.Timestamp) {
	const aDate = a.toDate()
	const bDate = b.toDate()
	const aHours = aDate.getHours()
	const bHours = bDate.getHours()
	if (aHours === bHours) {
		const aMinutes = aDate.getMinutes()
		const bMinutes = bDate.getMinutes()
		if (aMinutes === bMinutes) {
			return aDate.getSeconds() - bDate.getSeconds()
		}
		return (aMinutes - bMinutes) * 60
	}
	return (aHours - bHours) * 60 * 60
}