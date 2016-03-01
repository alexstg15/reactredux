import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'


import {firebase, helpers} from 'redux-react-firebase'
import moment from  'moment'

import TodayTasks from '../components/TodayTasks'
import TodayEvents from '../components/TodayEvents'

const {dataToJS} = helpers

export default
@firebase([

])
@connect(
	({firebase}) => ({

	})
)

class Home extends React.Component {

	constructor() {
		super()
	}

	render() {



		return (
			<div id="dashboard">
				<section id="page-title" className="padding-top-15 padding-bottom-15">
					<div className="row">
						<div className="col-sm-7">
							<h1 className="mainTitle">Dashboard</h1>
							<span className="mainDescription">a business overview</span>
						</div>
						<div className="col-sm-5">

						</div>
					</div>
				</section>
				<div className="container-fluid container-fullw bg-white">
					<div className="row">
						<div className="col-sm-6">

								<TodayTasks />

						</div>
						<div className="col-sm-6">

							<TodayEvents />

						</div>
					</div>
				</div>
			</div>

		)
	}
}