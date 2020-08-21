import React from 'react'
import DataTable, {createTheme} from 'react-data-table-component'
import Lab from '../model/Lab'
import Week from '../model/Week'
import '../styles/LabsTable.scss'

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

export default function LabsTable(props:
	{ labs: Array<{ courseReferenceNumber: string, labData: Lab }> }
) {
	const { labs } = props

	const [data, setData] = React.useState<Array<{
		courseReferenceNumber: string
		course: number
		section: number
		faculty: string
		building?: string
		room?: string
		times: string
	}>>()

	React.useEffect(() => {
		const flat = labs.map(lab => { return { courseReferenceNumber: lab.courseReferenceNumber, ...lab.labData } })
		const flatFaculty = flat.map(lab => { return { ...lab, faculty: lab.faculty.reduce((accumulator, current) => accumulator + ', ' + current) } })
		const weekToStr = (week: Week | undefined): string => {
			if (!week || (week.Monday.length === week.Tuesday.length && week.Tuesday.length === week.Wednesday.length && week.Wednesday.length === week.Thursday.length && week.Thursday.length === week.Friday.length && week.Friday.length === week.Saturday.length && week.Saturday.length === week.Sunday.length && !week.Monday.length)) return 'No Meetings'
			let str: string = ''
			if (week.Monday.length) {
				str = "Mo: "
				for (const ev of week.Monday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Tuesday.length) {
				str += `${str.length ? ',\n' : ''}Tu: `
				for (const ev of week.Tuesday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Wednesday.length) {
				str += `${str.length ? ',\n' : ''}We: `
				for (const ev of week.Wednesday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Thursday.length) {
				str += `${str.length ? ',\n' : ''}Th: `
				for (const ev of week.Thursday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Friday.length) {
				str += `${str.length ? ',\n' : ''}Fr: `
				for (const ev of week.Friday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Saturday.length) {
				str += `${str.length ? ',\n' : ''}Sa: `
				for (const ev of week.Saturday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			if (week.Sunday.length) {
				str += `${str.length ? ',\n' : ''}Su: `
				for (const ev of week.Sunday)
					str += `${ev.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${ev.stop.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
			}
			return str
		}
		const flatWeek = flatFaculty.map(lab => { return { ...lab, times: weekToStr(lab.times) } })
		setData(flatWeek)
	}, [labs])

	return (
		<div className="LabsTable">
			{data && <DataTable columns={[
				{
					name: 'CRN',
					selector: 'courseReferenceNumber',
					wrap: true,
					width: '9%'
				},
				{
					name: 'Course',
					selector: 'course',
					sortable: true,
					wrap: true,
					width: '7%'
				},
				{
					name: 'Section',
					selector: 'section',
					sortable: true,
					wrap: true,
					width: '7%'
				},
				{
					name: 'Meetings',
					selector: 'times',
					wrap: true,
					sortable: true,
					width: 'auto'
				},
				{
					name: 'Instructor(s)',
					selector: 'faculty',
					sortable: true,
					wrap: true,
					width: '20%'
				},
				{
					name: 'Building',
					selector: 'building',
					sortable: true,
					wrap: true,
					width: '12%'
				},
				{
					name: 'Room',
					selector: 'room',
					wrap: true,
					width: '7%'
				}
			]} data={data} keyField='courseReferenceNumber' striped={true} highlightOnHover={true} defaultSortField='course' noHeader={true} theme='nord' />}
		</div>
	)
}
