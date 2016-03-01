import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'
import * as History from '../models/History'

import * as MOpportunities from '../models/Opportunities'

import {firebase, helpers} from 'redux-react-firebase'
import Pagination from '../components/Pagination'

const {dataToJS} = helpers


export default
@firebase([
  ['opportunities'],
  'contacts'
])
@connect(
  ({firebase}) => ({
    opportunities: dataToJS(firebase, 'opportunities'),
    contacts: dataToJS(firebase, 'contacts')
  })
)
class OpportunityList extends Component {

  constructor() {
    super()
    this.state = { filter: '', currentPage: 1, perPage: 10 }
  }

  render() {

    const {opportunities, contacts, dispatch, firebase} = this.props
    const {perPage, currentPage} = this.state


    const handleDelete = id => event => {
      const opportunity = opportunities[id]
      const contact = opportunity.linkToContact
      bootbox.confirm('Are you sure you want to delete this opportunity ?', ok => {
        if(ok){
          firebase.remove(`opportunities/${id}`, () => {
            History.log(firebase, History.EVENT.DELETE, 'opportunity', id,contact, opportunity.name )
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

    const remapOpportunities = _.map(opportunities, (opportunity, id) => ({_id:id, ...opportunity}))

    const filteredOpportunities = _.filter(remapOpportunities, opportunity => !(this.state.filter && opportunity.name && opportunity.name.toLowerCase().indexOf(this.state.filter) == -1 ))

    const pagedOpportunities = _.filter(filteredOpportunities, (opportunity, idx) =>  (currentPage-1)*perPage  <= idx && idx <= currentPage * perPage)

    const transformedOpportunities = _.map(pagedOpportunities, opportunity => {

      const contact = (contacts) ? contacts[opportunity.linkToContact] : null
      const linkToContactName = (contact) ? contact.firstName  + ' ' + contact.lastName: ''

      const stageName = MOpportunities.getStageTextById(opportunity.stage)

      const type = MOpportunities.getTypeById(MOpportunities.getTypes(),opportunity.type)
      const typeName = (type) ? type.text : ''
      return {...opportunity, linkToContactName, stageName, typeName  }
    })
    const opportunityList = _.map( transformedOpportunities, (opportunity, id) => {
      return (
        <tr key={id}>
          <td>{opportunity.name}</td>
          <td>{opportunity.stageName}</td>
          <td>{opportunity.typeName}</td>
          <td>{opportunity.nextAction}</td>
          <td>{opportunity.note}</td>
          <td>{opportunity.linkToContactName}</td>
          <td>
            <Link to={'/opportunity/edit/' + opportunity._id} className="edit-row btn btn-sm green"><i className="fa fa-edit"></i> Edit</Link>&nbsp;
            <a  onClick={handleDelete(opportunity._id)} className="delete-row btn btn-sm red"><i className="fa fa-times"></i> Delete</a>
          </td>
        </tr>
      )
    })

    return (
      <div id="opportunity-list">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Opportunities</h1>
              <span className="mainDescription">all opportunities</span>
            </div>
            <div className="col-sm-5">
              <Link to="/opportunities/add"><button className="btn btn-green add-row margin-top-15 pull-right">
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
                <table className="table table-striped table-hover" id="sample_2">
                  <colgroup>
                    <col width="10%" />
                    <col width="12%" />
                    <col width="12%" />
                    <col width="10%" />
                    <col />
                    <col width="15%" />
                    <col width="15%" />
                  </colgroup>

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Stage</th>
                      <th>Type</th>
                      <th>Next Action</th>
                      <th>Notes</th>
                      <th>Link to Contact</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunityList}
                  </tbody>
                </table>
                <Pagination items={filteredOpportunities.length} perPage={perPage} currentPage={currentPage} onPageChange={handleChangePage}/>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }

}

