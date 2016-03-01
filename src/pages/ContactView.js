import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'
import moment from  'moment'

import * as History from '../models/History'


//import ContactEventMembershipModal from '../components/Contact/ContactEventMembershipModal'
import ContactEventModal from '../components/Contact/ContactEventModal'
import ContactAddNotesModal from '../components/Contact/ContactAddNotesModal'
import ContactAddServiceModal from '../components/Contact/ContactAddServiceModal'
//import ContactAddInnerAnimalDetailsModal from '../components/Contact/ContactAddInnerAnimalDetailsModal'
import ContactAddFileModal from '../components/Contact/ContactAddFileModal'
import ContactDeleteNoteModal from '../components/Contact/ContactDeleteNoteModal'
import ContactDeleteEventModal from '../components/Contact/ContactDeleteEventModal'

import Loading from '../components/Loading'
import ReactS3Uploader from 'react-s3-uploader'


import ContactAddUpdate from './ContactAddUpdate'

import {firebase, helpers} from 'redux-react-firebase'

const {dataToJS, isLoaded} = helpers


export default
@firebase([
	'contacts',
	['history']
])
@connect(
	({firebase}) => ({
		contacts: dataToJS(firebase, 'contacts'),
		history: dataToJS(firebase, 'history')
	})
)
class Contact extends Component {
	constructor() {
		super()
		this.state = {note: null, uploading: false}
	}

	render() {
		const {dispatch, contacts, params, firebase, history} = this.props

		if (!isLoaded(contacts)) {
			return (<Loading />)
		}


		const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )
		const contact = (id && contacts[id]) ? contacts[id] : {
			firstName: '',
			lastName: '',
			email: '',
			phone: [
				{type: '', number: ''},
				{type: '', number: ''}
			],
			address: '',
			city: '',
			state: '',
			zip: '',
			birthdate: '',
			referral: '',
			events: {},
			notes: {},
			company: '',
			profileImg: '',
			title: '',
			facebook: '',
			linkedin: '',
			twitter: '',
			google: '',
			ning: ''
		}
		if (typeof contact.phone == 'string') {
			contact.phone = [
				{type: 'work', number: contact.phone},
				{type: '', number: ''}
			]
		}

		const handleDeleteEvent = idEvent => event => {
			event.preventDefault()

			bootbox.confirm('Are you sure you want to delete this event ?', ok => {
				if (ok) {
					firebase.remove(`contacts/${id}/events/${idEvent}`, () => {
						History.log(firebase, History.EVENT.DELETE, 'event', idEvent, id)
					})
				}
			})

		}

		const setNote = note => event => {
			this.state.note = note
			this.setState(this.state)
		}

		const eventsList = _.map(contact.events, (event, id) => {
			const date = moment(Date.parse(event.time))
			const dayDate = date.format('MMM DD YYYY')
			const timeDate = date.format('h:mm A')
			return (
				<tr key={id}>
					<td className="hidden-xs">
						{dayDate}
					</td>
					<td className="hidden-xs">
						{timeDate}
					</td>
					<td className="hidden-xs">
						{(event.text) ? event.text : (event.type == 1) ? '1 Free event' : `${event.type} events`}
					</td>
					<td className="hidden-xs" width="35"
					    align="center"><a href="#" onClick={handleDeleteEvent(id)}
					                      className="confirm-delete-event btn btn-sm red"
					                      data-id="dynamicrowid"><i
						className="fa fa-times"></i></a>
					</td>
				</tr>
			)
		})

		const handleDeleteNote = idNote => note => {
			note.preventDefault()

			bootbox.confirm('Are you sure you want to delete this note ?', ok => {
				if (ok) {
					firebase.remove(`contacts/${id}/notes/${idNote}`, () => {
						History.log(firebase, History.EVENT.DELETE, 'note', idNote, id)
					})
				}
			})

		}

		const handleDeleteFile = idFile => file => {
			file.preventDefault()

			bootbox.confirm('Are you sure you want to delete this file ?', ok => {
				if (ok) {
					firebase.remove(`contacts/${id}/files/${idFile}`, () => {
						History.log(firebase, History.EVENT.DELETE, 'file', idFile, id)
					})
				}
			})

		}

		const notesList = _(contact.notes)
			.map((note, id) => ({id, ...note}))
			.sortBy(['note', 'time'])
			.reverse()
			.map(note => {
				const date = moment(Date.parse(note.time))
				const timeStamp = date.format('MMM DD YYYY h:mm A')
				const {id} = note

				return (
					<tr key={id}>
						<td className="center"><i className="fa fa-edit red"></i></td>
						<td className="">{note.text}</td>

						<td className="">{timeStamp}</td>
						<td className="center">
							<div className="visible-md visible-lg hidden-sm hidden-xs">
								<a data-toggle="modal" href="#responsive" className="btn btn-transparent btn-xs" tooltip-placement="top"
								   tooltip="Edit" onClick={setNote(note)}>
									<i className="fa fa-pencil"></i></a>
								<a href="#" onClick={handleDeleteNote(id)} className="btn btn-transparent btn-xs tooltips"
								   tooltip-placement="top" tooltip="Remove"><i className="fa fa-times fa fa-white"></i></a>
							</div>
						</td>
					</tr>
				)
			})
			.value()

		const showEdit = event => {
			event.preventDefault()
			$('#tab a[href="#edit"]').tab('show')
		}
		const showNotes = event => {
			event.preventDefault()
			$('#tab a[href="#notes"]').tab('show')
		}
		const showFiles = event => {
			event.preventDefault()
			$('#tab a[href="#files"]').tab('show')
		}

		const showEvents = event => {
			event.preventDefault()
			$('#tab a[href="#sessions"]').tab('show')
		}
		const showCourses = event => {
			event.preventDefault()
			$('#tab a[href="#courses"]').tab('show')
		}

		const filesList = _(contact.files)
			.map((file, id) => {
				return (
					<tr key={id}>
						<td><a href={`https://es18-admin-files.s3.amazonaws.com/${file}`} target="_blank">{file}</a></td>
						<td className="center">
							<div className="visible-md visible-lg hidden-sm hidden-xs">
								<a href="#" onClick={handleDeleteFile(id)} className="btn btn-transparent btn-xs tooltips"
								   tooltip-placement="top" tooltip="Remove"><i className="fa fa-times fa fa-white"></i></a>
							</div>
						</td>
					</tr>)
			})
			.value()

		const onUploadFinish = (file) => {
			firebase.set(`contacts/${id}/profileImg`, file.filename)
			this.state.uploading = false
			this.setState(this.state)
		}

		const onUploadProgress = p => {
			this.state.uploading = p
			this.setState(this.state)
		}
		const onImgError = e => {
			e.target.src = '/assets/images/default-user.png'
		}

		const upload = (this.state.uploading !== false) ?
			`Uploading ${this.state.uploading}%`
			: (<ReactS3Uploader
			signingUrl="http://scripts.earthstar18.com/s3/sign"
			accept="*"
			uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
			onFinish={onUploadFinish}
			onProgress={onUploadProgress}
			contentDisposition="auto"
			id = "s3upload"
		/>)


		const courseTypes = {
			virtual: 'Virtual',
			inperson: 'In Person'
		}

		const chakra = {
			foot: 'Foot',
			root: 'Root',
			sacral: 'Sacral',
			solarplexus: 'Solar Plexus',
			heart: 'Heart',
			throat: 'Throat',
			thirdeye: 'Third Eye',
			crown: 'Crown',
		}

		const editCourse = courseId => event => {
			this.state.courseId = courseId
			this.setState(this.state)
		}

		const coursesList = _.map(contact.courses, (course, courseId) => {
			return (
				<div key={courseId}>
					<table className="table table-striped table-bordered table-advance table-hover">
						<thead>
						<tr>
							<th>Course Name</th>
							<th>Details</th>
						</tr>
						</thead>
						<tbody>

						<tr>
							<td>
								<p>Inner Animal</p>
								<p>
									<button href="#membership" data-toggle="modal" className="btn blue" type="button"
									        onClick={editCourse(courseId)}>

										<span>Edit</span>
									</button>
								</p>
							</td>
							<td>
								<p>
									<span className="bold">Workshop Location</span><br />{courseTypes[course.type]} </p>

								{/*   <p> */}
								{/*     <span className="bold">Course Starts</span><br /> */}
								{/*     12/14/2015 </p> */}
								{/*  */}
								{/*   <p> */}
								{/*     <span className="bold">Starlight Energy</span><br /> */}
								{/*     12/16/2015 - */}
								{/*     8/3/2016 </p> */}
							</td>

						</tr>
						</tbody>
					</table>
					<table className="table table-striped table-bordered table-advance table-hover">
						<thead>
						<tr>
							<th>Chakra</th>
							<th>Animals</th>
							<th>Scheduled Call</th>
						</tr>
						</thead>
						<tbody>
						{
							_.map(course.animals, (animal, animalId) => {

								return (
									<tr key={courseId+'_'+animalId}>
										<td>{chakra[animalId]}</td>
										<td>{animal.animals.filter(a => !!a).join(',')}</td>
										<td>{animal.date}</td>
									</tr>
								)
							})
						}
						</tbody>
					</table>
				</div>
			)
		})


		const historyList = _(history)
			.map((log, _id) => ({_id, ...log}))
			.filter(log => log.contact == id)
			.sortBy(['time'])
			.reverse()
			.map(log => {
				const evs = {
					DELETE: 'Deleted',
					UPDATE: 'Changed',
					ADD: 'Added'
				}
				let link = log.what
				switch (log.what) {
					case 'task':
						link = (<Link to={`/tasks/edit/${log.id}`}>{log.what}</Link>)
						break
					case 'contact':
						link = (<Link to={`/contact/${log.id}`}>{log.what}</Link>)
						break
					case 'opportunity':
						link = (<Link to={`/opportunity/edit/${log.id}`}>{log.what}</Link>)
						break
					case 'contact':
						link = (<a href='#' onClick={showEdit}>{log.what}</a>)
						break
					case 'note':
						link = (<a href='#' onClick={showNotes}>{log.what}</a>)
						break
					case 'file':
						link = (<a href='#' onClick={showFiles}>{log.what}</a>)
						break
					case 'event':
						link = (<a href='#' onClick={showEvents}>{log.what}</a>)
						break
					case 'course':
						link = (<a href='#' onClick={showCourses}>{log.what}</a>)
						break

				}
				return (
					<tr key={log._id}>
						<td className="center"><i className="fa fa-edit red"></i></td>
						<td className="">{moment(log.time).format('MM-DD-YYYY hh:mm A')}</td>
						<td>
							{evs[log.event]} {link} {log.data}
						</td>
					</tr>

				)
			})
			.value()

		return (
			<div className="contact-profile">
				<section id="page-title" className="padding-top-15 padding-bottom-15">
					<div className="row">
						<div className="col-sm-7">
							<h1 className="mainTitle">{contact.firstName} {contact.lastName}</h1>
							<span className="mainDescription"></span>
						</div>
						<div className="col-sm-5">
							<div className="btn-group pull-right">
								<a href="#" data-toggle="dropdown" className="btn btn-primary dropdown-toggle">
									Actions <span className="caret"></span>
								</a>

								<ul className="dropdown-menu" role="menu">
									<li role="presentation" className="dropdown-header">
										I want to:
									</li>
									<li>
										<a data-toggle="modal" href="#membership" onClick={editCourse(undefined)}>
											Add an Event
										</a>
									</li>
									<li>
										<Link to={`/opportunities/add/${id}`}>
											Add an Opportunity
										</Link>
									</li>
									<li>
										<Link to={`/tasks/add/${id}`}>
											Add a Task
										</Link>
									</li>
									<li>
										<a data-toggle="modal" href="#responsive" onClick={setNote(null)}>
											Add a Note
										</a>
									</li>
									<li>
										<a data-toggle="modal"
										   href="#addfile">
											Add a File
										</a>
									</li>

								</ul>
							</div>
						</div>
					</div>
				</section>

				<div className="row">
					<div className="col-sm-5 col-md-4">
						<div className="user-left">
							<div className="center">
								<div className="user-image margin-top-15">
									<img className="profile thumbnail" src={`https://es18-admin-files.s3.amazonaws.com/${contact.profileImg}`}
									     alt="" onError={onImgError}/>

									<div className="user-image-buttons">
										<label htmlFor="s3upload"><span className="btn btn-azure btn-file btn-sm">
											<span className="fileinput-exists"><i className="fa fa-pencil"></i></span>
										</span></label>
										{upload}
								</div>

								</div>
								<hr />
								<div className="social-icons block">
									<ul>
										{contact.twitter ?
											<li data-placement="top" data-original-title="Twitter" className="social-twitter tooltips">
												<a href={contact.twitter} target="_blank">Twitter </a>
											</li>
											: ''}
										{contact.facebook ?
										<li data-placement="top" data-original-title="Facebook" className="social-facebook tooltips">
											<a href={contact.facebook} target="_blank">Facebook</a>
										</li>
											: ''}
										{contact.google ?
										<li data-placement="top" data-original-title="Google" className="social-google tooltips">
											<a href={contact.google} target="_blank">Google+</a>
										</li>
											: ''}
										{contact.linkedin ?
										<li data-placement="top" data-original-title="LinkedIn" className="social-linkedin tooltips">
											<a href={contact.linkedin} target="_blank">LinkedIn</a>
										</li>
											: ''}
										{contact.ning ?
										<li data-placement="top" data-original-title="Github" className="social-github tooltips">
											<a href={contact.ning} target="_blank">Github</a>
										</li>
											: ''}
									</ul>
								</div>
								<hr />
							</div>
							<table className="table table-condensed">
								<thead>
								<tr>
									<th colSpan="3">Contact Information</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>email:</td>
									<td>
										<a href={'mailto:'+contact.email}>
											{contact.email}
										</a></td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								<tr>
									<td>phone:</td>
									<td>{(typeof contact.phone == 'string') ? contact.phone : contact.phone[0].number}</td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								<tr>
									<td>fax:</td>
									<td>
										{contact.fax}
									</td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								<tr>
									<td>url:</td>
									<td>
										<a href={contact.website} target="_blank">
											{contact.website}
										</a></td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								<tr>
									<td>birthday:</td>
									<td>
										{contact.birthdate}
									</td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								<tr>
									<td>referral source:</td>
									<td>
										{contact.referral}
									</td>
									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								</tbody>
							</table>
							<table className="table">
								<thead>
								<tr>
									<th colSpan="2">Address</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>{contact.address}<br />
										{contact.city}, {contact.state} {contact.zip}</td>

									<td><a href="#edit" data-toggle="tab" onClick={showEdit}><i
										className="fa fa-pencil edit-user-info"></i></a>
									</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="col-sm-7 col-md-8 margin-top-15">
						<div className="tabbable tabbable-custom tabbable-full-width">

							<ul className="nav nav-tabs" id="tab">
								<li className="active"><a href="#sessions"
								                          data-toggle="tab">Sessions</a></li>
								<li><a href="#notes" data-toggle="tab">Notes</a></li>
								<li><a href="#files" data-toggle="tab">Files</a></li>
								<li><a href="#courses" data-toggle="tab">Courses</a></li>
								<li><a href="#history" data-toggle="tab">History</a></li>
								<li id="tabEdit" aria-controls="edit"><a href="#edit" data-toggle="tab">Edit</a></li>
							</ul>

							<div id="tab" className="tab-content">

								<div className="tab-pane active" id="sessions">
									<div className="portlet-body">
										<table className="table table-striped table-bordered table-advance table-hover">
											<tbody>
											<tr>
												<td className="hidden-xs">
													<table className="table table-striped table-bordered table-advance table-hover">
														<thead>
														<tr>
															<th className="hidden-xs"><i className="fa fa-calendar"></i> Date</th>
															<th className="hidden-xs">Time</th>
															<th><i className="fa fa-briefcase"></i>Session (Package)</th>
															<th>Delete</th>
														</tr>
														</thead>
														<tbody>
														{eventsList}
														</tbody>
													</table>
												</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div className="tab-pane" id="notes">
									<div className="tab-pane active" id="tab_1_1_1">
										<div className="scroller" data-height="290px"
										     data-always-visible="1"
										     data-rail-visible1="1">
											<a className="btn btn-wide btn-primary" data-toggle="modal" href="#responsive"><i
												className="fa fa-plus"></i> Add a Note</a>
											<table className="table table-hover" id="sample-table-1">
												<tbody>
												{notesList}
												</tbody>
											</table>

										</div>
									</div>
								</div>

								<div className="tab-pane" id="files">
									<div className="tab-pane active" id="tab_1_1_11">
										<div className="scroller" data-height="290px"
										     data-always-visible="1"
										     data-rail-visible1="1">
											<a className="btn btn-wide btn-primary" data-toggle="modal" href="#addfile"><i
												className="fa fa-plus"></i> Add a File</a>
											<table className="table table-hover" id="sample-table-1">
												<tbody>
												{filesList}
												</tbody>
											</table>

										</div>
									</div>
								</div>

								<div className="tab-pane" id="courses">
									<div className="row">
										<div className="col-md-12">
											{coursesList}
										</div>
									</div>
								</div>


								<div className="tab-pane" id="history">
									<div className="tab-pane active" id="tab_1_1_1">
										<div className="scroller" data-height="290px"
										     data-always-visible="1"
										     data-rail-visible1="1">
											<table className="table table-hover" id="sample-table-1">
												<tbody>
												{historyList}
												</tbody>
											</table>

										</div>
									</div>
								</div>

								<div className="tab-pane" id="edit">
									<div className="row profile-account">
										<div className="col-md-12">
											<div className="tab-content">
												<div id="tab_1-1" className="tab-pane active">
													<ContactAddUpdate id={id}/>
												</div>
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>

					<ContactEventModal id={id} courseId={this.state.courseId}/>

					<ContactAddNotesModal id={id} editNote={this.state.note}/>

					{/* <ContactAddServiceModal /> */}

					<ContactAddFileModal id={id}/>

					{/* <ContactDeleteNoteModal /> */}

					{/* <ContactDeleteEventModal /> */}

				</div>
			</div>
		)
	}
}
