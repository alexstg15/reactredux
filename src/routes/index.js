import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'

import AppContainer from '../components/Container'
import LoginContainer from '../components/LoginContainer'

import Home from '../pages/Home'
import NoMatch from '../pages/NoMatch'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Tasks from '../pages/TaskList'
import TasksAdd from '../pages/TaskAddUpdate'
import ContactView from '../pages/ContactView'
import ContactList from '../pages/ContactList'
import ContactAddUpdate from '../pages/ContactAddUpdate'
import CompanyView from '../pages/CompanyView'
import CompanyList from '../pages/CompanyList'
import CompanyAddUpdate from '../pages/CompanyAddUpdate'
import OpportunityList from '../pages/OpportunityList'
import OpportunityAdd from '../pages/OpportunityAddUpdate'
import UpcomingEvents from '../pages/UpcomingEvents'


const routes = (
	<Route>
		<Route path='/' component={AppContainer}>
			<IndexRoute  component={Home} />
			<Route path="admin" component={Home}/>
			<Route path="upcoming-events" component={UpcomingEvents}/>
			<Route path="tasks" component={Tasks}/>
			<Route path="tasks/add" component={TasksAdd}/>
			<Route path="tasks/add/:contact" component={TasksAdd}/>
			<Route path="tasks/edit/:id" component={TasksAdd}/>
			<Route path="contact/add" component={ContactAddUpdate}/>
			<Route path="contact/:id" component={ContactView}/>
			<Route path="contacts" component={ContactList}/>
			<Route path="contact/edit/:id" component={ContactAddUpdate}/>
			<Route path="company/:id" component={CompanyView}/>
			<Route path="companies" component={CompanyList}/>
			<Route path="companies/add" component={CompanyAddUpdate}/>
			<Route path="company/edit/:id" component={CompanyAddUpdate}/>
			<Route path="opportunities" component={OpportunityList}/>
			<Route path="opportunities/add" component={OpportunityAdd}/>
			<Route path="opportunities/add/:contact" component={OpportunityAdd}/>
			<Route path="opportunity/edit/:id" component={OpportunityAdd}/>
			</Route>
			<Route component={LoginContainer}>
				<Route path="/login" component={Login}/>
				<Route path="/signup" component={Signup}/>
			</Route>
			<Route path="*" component={NoMatch}/>
	</Route>
)

export default routes
