import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'
import moment from  'moment'

import Select from 'react-select'

import Loading from '../components/Loading'

import CompanyAddUpdate from './CompanyAddUpdate'
import ReactS3Uploader from 'react-s3-uploader'

import {firebase, helpers} from 'redux-react-firebase'

const {dataToJS, isLoaded} = helpers


export default
@firebase([
  'companies',
  'contacts'
])
@connect(
  ({firebase}) => ({
    companies: dataToJS(firebase, 'companies'),
    contacts: dataToJS(firebase, 'contacts')
  })
)
class CompanyView extends Component {
  constructor() {
    super()
    this.state = {filter: '', currentPage: 1, perPage: 10, person:null, uploading:false}
  }

  render() {
    const {dispatch, companies, contacts, params, firebase} = this.props
    const {perPage, currentPage} = this.state

    if (!isLoaded(companies)) {
      return (<Loading />)
    }

    const itemSelected = item => {
      this.state.person = item
    }

    const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )
    const company = (id && companies[id]) ? companies[id] : {
      companyName: '',
      companyType: '',
      email: '',
      phone: '',
      fax: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      people: {},
      profileImg: ''
    }

    const handleRemove = id => event => {
      bootbox.confirm('Are you sure you want to remove this contact from this company?', ok => {
        if(ok){
          firebase.remove(`contacts/${id}/company`)
        }
      })

    }

    const addContact = () => {
      if(this.state.person){
        firebase.set(`contacts/${this.state.person}/company`,id)
        this.state.person = null
        this.setState(this.state)
      }
    }

    const remapContacts = _.map(contacts, (contact, id) => ({_id: id, ...contact}))

    const filteredContacts = _(remapContacts)
    .filter(contact => !(this.state.filter && contact.lastName.toLowerCase().indexOf(this.state.filter) == -1 && contact.firstName.toLowerCase().indexOf(this.state.filter) == -1))
    .filter( contact => {
      return contact.company == id
    } )
    .value()

    const pagedContacts = _.filter(filteredContacts, (contact, idx) =>  (currentPage - 1) * perPage <= idx && idx <= currentPage * perPage)


    const contactsList = _.map(pagedContacts, (contact, idx) => {
      return (
        <tr key={contact._id} className='clickableRow' style={{cursor: 'pointer'}}>
          <td>{contact.firstName} {contact.lastName}</td>
          <td>{contact.title}</td>
          <td>{(typeof contact.phone == 'string') ? contact.phone : contact.phone[0].number}</td>
          <td>
            <Link to={'/contact/'+contact._id} className="btn btn-sm green"> <i className="fa fa-edit"></i> View </Link>
            <a onClick={handleRemove(contact._id)} className="btn btn-sm red"><i className="fa fa-times"></i> Remove</a>
          </td>
        </tr>
      )
    })

    const people = _(contacts)
      .map((contact, id) => ({value: id, label: contact.firstName + ' ' +contact.lastName, company:contact.company}))
      .filter(contact => !contact.company)
      .value()

    const onUploadFinish = (file) => {
      firebase.set(`companies/${id}/profileImg`, file.filename)
      this.state.uploading = false
      this.setState(this.state)
    }

    const onUploadProgress = p => {
      this.state.uploading = p
      this.setState(this.state)
    }

    const onImgError = e => {
      e.target.src='/assets/images/default-user.png'
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
                     />)

    return (
      <div className="company-profile">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">{company.companyName}</h1>
              <span className="mainDescription">({company.companyType})</span>
            </div>
          </div>
        </section>
        <div className="row">
          <div className="col-sm-5 col-md-4">
            <div className="user-left">
              <div className="center">
                <div className="user-image margin-top-15">
                  <img className="profile" src={`https://es18-admin-files.s3.amazonaws.com/${company.profileImg}`} alt="" onError={onImgError}/>
                  {upload}
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
                    <td>url:</td>
                    <td>
                      <a href={company.website} target="_blank">
                        {company.website}
                    </a></td>
                    <td><a  href="#edit" data-toggle="tab"><i className="fa fa-pencil edit-user-info"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td>email:</td>
                    <td>
                      <a href={'mailto:'+company.email}>
                        {company.email}
                    </a></td>
                    <td><a  href="#edit" data-toggle="tab"><i className="fa fa-pencil edit-user-info"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td>phone:</td>
                    <td>{company.phone}</td>
                    <td><a  href="#edit" data-toggle="tab"><i className="fa fa-pencil edit-user-info"></i></a>
                    </td>
                  </tr>
                  <tr>
                    <td>fax:</td>
                    <td>
                      {company.fax}
                    </td>
                    <td><a  href="#edit" data-toggle="tab"><i className="fa fa-pencil edit-user-info"></i></a>
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
                    <td>{company.address}<br />
                      {company.city}, {company.state} {company.zip}</td>

                    <td><a  href="#edit" data-toggle="tab"><i className="fa fa-pencil edit-user-info"></i></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-sm-7 col-md-8 margin-top-15">
            <div className="tabbable tabbable-custom tabbable-full-width">
              <ul className="nav nav-tabs">
                <li className="active"><a href="#people" data-toggle="tab">People</a></li>
                <li><a href="#edit" data-toggle="tab">Edit</a></li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active" id="people">
                  <div className="row">
                    <div className="col-md-12">

                      <formgroup>
                        <label htmlFor="add-person">Add a Person</label>
                        {/* <input type="text" className="form-control" name="person" ref="person"/> */}
                        <div className="row">
                          <div className="col-xs-11">
                            <Select onChange={itemSelected} simpleValue options={people} multi={false} value={this.state.person} />
                          </div>
                          <div className="col-xs-1">
                            <button className="btn btn-green" onClick={addContact}>Add</button>
                          </div>
                        </div>
                      </formgroup>

                      <div className="table-responsive">
                        <table className="table table-striped table-hover table-condensed" id="contact_list">
                          <colgroup>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col />
                            <col width="20%"/>
                            <col width="15%"/>
                          </colgroup>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Title</th>
                              <th>Phone</th>
                              <th>&nbsp;</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contactsList}
                          </tbody>
                        </table>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="edit">
                  <div className="row profile-account">


                    <div className="col-md-12">
                      <div className="tab-content">
                        <div id="tab_1-1" className="tab-pane active">
                          <CompanyAddUpdate id={id}/>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
