import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'
import * as History from '../models/History'

import {firebase, helpers} from 'redux-react-firebase'
import Pagination from '../components/Pagination'
const {dataToJS} = helpers


export default
@firebase([
  ['companies']
])
@connect(
  ({firebase}) => ({
    companies: dataToJS(firebase, 'companies')
  })
)

class CompanyList extends Component {

  constructor() {
    super()
    this.state = { filter: '', currentPage: 1, perPage: 10 }
  }

  render() {
    const {companies, dispatch, firebase} = this.props
    const {perPage, currentPage} = this.state

    const handleDelete = id => event => {
      bootbox.confirm('Are you sure you want to delete this company ?', ok => {
        if(ok){
          firebase.remove(`companies/${id}`)
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

    const remapCompanies = _.map(companies, (company, id) => ({_id:id, ...company}))

    const filteredCompanies = _.filter(remapCompanies, company => !(this.state.filter && company.companyName.toLowerCase().indexOf(this.state.filter) == -1 ))

    const pagedCompanies = _.filter(filteredCompanies, (company, idx) =>  (currentPage-1)*perPage  <= idx && idx <= currentPage * perPage)

    const companyList = _.map( pagedCompanies, (company, id) => {

      return (
        <tr key={id} className='clickableRow' style={{cursor: 'pointer'}}>
          <td>{company.companyName}</td>
          <td>{company.phone}</td>
          <td>{company.fax}</td>
          <td>{company.companyType}</td>
          <td width="70">
            <Link to={'/company/'+company._id} className="btn btn-sm green"> <i className="fa fa-edit"></i> View </Link>
            <a onClick={handleDelete(company._id)} className="delete-row btn btn-sm red"><i className="fa fa-times"></i> Delete</a>
           </td>
        </tr>
      )
    })

    return (
      <div id="company-list">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Companies</h1>
              <span className="mainDescription">all companies</span>
            </div>
            <div className="col-sm-5">
              <Link to="/companies/add"><button className="btn btn-green add-row margin-top-15 pull-right">
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
              <table className="table table-striped table-hover" id="company_list">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Phone</th>
                    <th>Fax</th>
                    <th>Type</th>
                    <th width="80">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {companyList}
                </tbody>
              </table>
              <Pagination items={filteredCompanies.length} perPage={perPage} currentPage={currentPage} onPageChange={handleChangePage}/>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

