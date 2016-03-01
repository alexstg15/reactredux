import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'
import {firebase, helpers} from 'redux-react-firebase'
import Pagination from '../components/Pagination'
import * as History from '../models/History'

const {dataToJS} = helpers

export default
@firebase([
  ['contacts']
])
@connect(
  ({firebase}) => ({
    contacts: dataToJS(firebase, 'contacts')
  })
)
class ContactList extends Component {
  constructor() {
    super()
    this.state = { filter: '', currentPage: 1, perPage: 10 }
  }

  render() {
    const {contacts, dispatch, firebase} = this.props
    const {perPage, currentPage} = this.state

    const handleDelete = id => event => {
      const contact = contacts[id]
      const name = contact.firstName + ' ' + contact.lastName
      bootbox.confirm('Are you sure you want to delete this contact ?', ok => {
        if(ok){
          firebase.remove(`contacts/${id}`, () => {
            History.log(firebase, History.EVENT.DELETE, 'contact', id,id, name )
          })
        }
      })

    }

    const filterResult = event => {
      const filter = this.refs.filter.value.toLowerCase()
      this.state.filter = filter
      this.setState(this.state)
    }

    const handleChangePage = page => {
      this.state.currentPage = page
      this.setState(this.state)
    }

    const remapContacts = _.map(contacts, (contact, id) => ({_id:id, ...contact}))

    const filteredContacts = _.filter(remapContacts, contact => !(this.state.filter && contact.lastName.toLowerCase().indexOf(this.state.filter) == -1 &&  contact.firstName.toLowerCase().indexOf(this.state.filter) == -1))

    const pagedContacts = _.filter(filteredContacts, (contact, idx) =>  (currentPage-1)*perPage  <= idx && idx <= currentPage * perPage)


    const contactsList = _.map( pagedContacts, (contact, idx) => {
      return (
        <tr key={contact._id} className='clickableRow' style={{cursor: 'pointer'}}>
          <td>{contact.lastName}</td>
          <td>{contact.firstName}</td>
          <td>{contact.email}</td>
          <td>{(typeof contact.phone == 'string') ? contact.phone : contact.phone[0].number}</td>
          <td>
            <Link to={'/contact/'+contact._id} className="btn btn-sm green"> <i className="fa fa-edit"></i> View </Link>
            <a onClick={handleDelete(contact._id)} className="btn btn-sm red"><i className="fa fa-times"></i> Delete</a></td>
        </tr>
      )
    })

    return (
      <div id="contact-list">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Contacts</h1>
              <span className="mainDescription">all contacts</span>
            </div>
            <div className="col-sm-5">
              <Link to="/contact/add"><button className="btn btn-green add-row margin-top-15 pull-right">
                Add New&nbsp;<i className="fa fa-plus"></i>
              </button>
              </Link>
            </div>
          </div>
        </section>
        <div className="container-fluid container-fullw bg-white">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-sm-3">
                  <div className="table-filter form-group">
                    <label>Filter by Name&nbsp;</label>
                    <input className="form-control" type="text" name="filter" id="filter" ref="filter" onChange={filterResult} />
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover" id="contact_list">
                  <colgroup>
                    <col width="20%" />
                    <col width="20%" />
                    <col />
                    <col width="20%" />
                    <col width="15%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Last Name</th>
                      <th>First Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsList}
                  </tbody>
                </table>
                <Pagination items={filteredContacts.length} perPage={perPage} currentPage={currentPage} onPageChange={handleChangePage}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

