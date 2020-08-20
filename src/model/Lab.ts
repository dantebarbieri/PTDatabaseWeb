export default class Lab {
	public course: number
	public section: number
	public days: string
	public startTime: number
	public endTime: number

	constructor(course: number = 0, section: number = 0, days: string = "", startTime: number = -1, endTime: number = -1) {
		this.course = course
		this.section = section
		this.days = days
		this.startTime = startTime
		this.endTime = endTime
	}

	static LabFromObj(obj: any): Lab {
		let course = obj.course ?? 0
		let section = obj.section ?? 0
		let days = obj.days ?? ""
		let startTime = obj.startTime ?? -1
		let endTime = obj.endTime ?? -1
		return new Lab(course, section, days, startTime, endTime)
	}

	get name(): string {
		return `${this.course}-${this.section}`
	}

	get info(): string {
		if (this.days === "")
			return `${this.name} ONLINE`
		else
			return `${this.name} ${this.days} ${Lab.timeToStr(this.startTime)} - ${Lab.timeToStr(this.endTime)}`
	}

	get id(): number {
		return parseInt(`${this.course}${this.section}`)
	}

	static timeToStr(time: number): string {
		let minute: number | string = time % 100
		let hour = Math.floor(time / 100)
		let suffix = ""

		if (minute < 10)
			minute = `0${minute}`

		if (hour < 12)
			suffix = "AM"
		else
			suffix = "PM"

		hour %= 12

		if (hour === 0)
			hour = 12

		return `${hour}:${minute} ${suffix}`;
	}

	toString(): string {
		return this.info;
	}
}