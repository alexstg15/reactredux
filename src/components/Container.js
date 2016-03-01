import React, {Component} from 'react'
import {connect} from 'react-redux'

import Sidebar from './Sidebar'
import Navigation from './Navigation'
import Login from '../pages/Login'


import {firebase, helpers} from 'redux-react-firebase'

const {dataToJS, pathToJS} = helpers

export default
@connect(
	({firebase}) => ({
		auth: pathToJS(firebase, 'auth'),
		authError: pathToJS(firebase, 'authError')
	})
)
@firebase([])
class AppContainer extends Component {
	constructor() {
		super()
		this.state = {slider: false}
	}

	render() {

		const {dispatch, user, authError, auth} = this.props

		const handleSidebarChange = () => {
			this.state.sidebar = !this.state.sidebar
			this.setState(this.state)
		}

		const sidebarClass = (this.state.sidebar) ? 'app-sidebar-closed' : ''

		if (!auth) {
			return (<Login />)
		}

		return (
			<div id='app' className={sidebarClass + 'app-navbar-fixed app-sidebar-fixed'} data-state="slide-open">
				<Sidebar />
				<div className="app-content">
					<Navigation onSidebarChange={handleSidebarChange}/>
					<div className="main-content">
						<div className="wrap-content container" id="container">
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		)

	}
}

