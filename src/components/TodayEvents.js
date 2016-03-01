import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'

import {firebase, helpers} from 'redux-react-firebase'
import moment from  'moment'
import Pagination from '../components/Pagination'


const {dataToJS} = helpers

export default
@firebase([
	'contacts'
])
@connect(
	({firebase}) => ({
		contacts: dataToJS(firebase, 'contacts')
	})
)

class TodayEvents extends React.Component {

	constructor() {
		super()
		this.state = {filter: '', currentPage: 1, perPage: 10}
	}

	render() {

		const {contacts} = this.props

		const {perPage, currentPage} = this.state

		const handleChangePage = page => {
			this.state.currentPage = page
			this.setState(this.state)
		}


		const pagedEvents = _(contacts)
			.map( (contact, id) => {
				const todayEvents = _.filter(contact.events, event => moment(event.time).isSame(moment(), 'day'))
				return _.map(todayEvents, event => ({ id, firstName : contact.firstName, lastName : contact.lastName, eventText : event.text, eventTime : event.time }))
			})
			.flatten()
			.filter( (task, idx) =>  (currentPage - 1) * perPage <= idx && idx <= currentPage * perPage)
			.value()
		const eventsList = _(pagedEvents)
			.map( (event, id) => {
				const date = moment(Date.parse(event.eventTime) )
				const dayDate = date.format('MMM DD YYYY')
				const timeDate = date.format('h:mm A')

				return (
					<tr key={id}>
						<td className="hidden-xs">
							{event.firstName} {event.lastName}
						</td>
						<td className="hidden-xs">
							{(event.eventText) ? event.eventText : (event.type ==1) ? '1 Free event' : `${event.type} events`}
						</td>
						<td className="hidden-xs">
							{timeDate}
						</td>
					</tr>
				)
			})
			.value()


		return (

							<div className="panel panel-white">
								<div className="panel-heading">
									<div className="panel-title">
										Today's Events
									</div>
								</div>
								<div className="panel-body">
									<div className="table-responsive">
										<table className="table table-striped table-hover table-condensed" id="tasks_list">
											<thead>
											<tr>
												<th>Who</th>
												<th>What</th>
												<th>When</th>
											</tr>
											</thead>
											<tbody>
											{eventsList}
											</tbody>
										</table>
											<Pagination items={pagedEvents.length} perPage={perPage} currentPage={currentPage}
										 onPageChange={handleChangePage}/>

									</div>
								</div>
							</div>

		)
	}
}