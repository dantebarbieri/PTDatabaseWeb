import React from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import Week from '../../../model/Week'
import '../../../styles/ScheduleTable.scss'

createTheme('nord', {
	text: {
		primary: '#ECEFF4',
		secondary: '#D8DEE9',
	},
	background: {
		default: '#3B4252',
	},
	highlightOnHover: {
		default: '#EBCB8B',
		text: 'rgba(46, 52, 64, 0.87)',
	},
	striped: {
		default: '#2E3440',
		text: '#ECEFF4',
	},
	divider: {
		default: '#4C566A',
	},
	sortFocus: {
		default: '#EBCB8B',
	},
})

export default function ScheduleTable(props:
	{ schedule: { [courseName: string]: Week } }
) {
	const { schedule } = props

	const [data, setData] = React.useState<Array<{
		course: string
		times: string
	}>>()

	React.useEffect(() => {
		const flat = Object.keys(schedule).map(key => { return { course: key, times: schedule[key] } })
		const weekToStr = (week: Week | undefined): string => {
			if (!week || (week.Monday.length === week.Tuesday.length && week.Tuesday.length === week.Wednesday.length && week.Wednesday.length === week.Thursday.length && week.Thursday.length === week.Friday.length && week.Friday.length === week.Saturday.length && week.Saturday.length === week.Sunday.length && !week.Monday.length)) return 'No Meetings'
			let str: string = ''
			if (week.Monday.length) {
				const list = week.Monday.sort((a, b) => a.start.seconds - b.start.seconds)
				str = "Mo: "
				for (const ev of list)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Tuesday.length) {
				const list = week.Tuesday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}Tu: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Wednesday.length) {
				const list = week.Wednesday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}We: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Thursday.length) {
				const list = week.Thursday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}Th: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Friday.length) {
				const list = week.Friday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}Fr: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Saturday.length) {
				const list = week.Saturday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}Sa: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			if (week.Sunday.length) {
				const list = week.Sunday.sort((a, b) => a.start.seconds - b.start.seconds)
				str += `${str.length ? ' |\n' : ''}Su: `
				for (const ev of list)
				str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${ev !== list[list.length - 1] ? ', ' : ''}`
			}
			return str
		}
		const flatWeek = flat.map(course => { return { ...course, times: weekToStr(course.times) } })
		setData(flatWeek)
	}, [schedule])

	return (
		<div className="LabsTable">
			{data && <DataTable columns={[
				{
					name: 'Course',
					selector: 'course',
					wrap: true,
					sortable: true,
					width: '15%'
				},
				{
					name: 'Meetings',
					selector: 'times',
					wrap: true,
					sortable: true,
					width: 'auto'
				},
			]} data={data} keyField='course' striped={true} highlightOnHover={true} defaultSortField='course' noHeader={true} theme='nord' />}
		</div>
	)
}
