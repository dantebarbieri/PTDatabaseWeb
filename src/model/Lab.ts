import Week from "./Week";

export default interface Lab {
	course: number
	section: number
	faculty: string[]
	building?: string
	room?: string
	times?: Week
}