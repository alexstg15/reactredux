import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'

import {firebase, helpers} from 'redux-react-firebase'
import Pagination from '../components/Pagination'

import * as MTasks from '../models/Tasks'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'

import * as History from '../models/History'

const {dataToJS} = helpers

export default
@firebase([
  ['tasks']
])
@connect(
  ({firebase}) => ({
    tasks: dataToJS(firebase, 'tasks')
  })
)
class Tasks extends Component {
  constructor() {
    super()
    this.state = {
      filter: '',
      currentPage: 1,
      perPage: 10,
      type: null,
      fromDate: null,
      toDate: null
    }
  }

  render() {
    const {tasks, dispatch, firebase} = this.props
    const {perPage, currentPage} = this.state

    const handleDelete = id => event => {
      const task = tasks[id]
      const contact = tasks.linkToContact
      bootbox.confirm('Are you sure you want to delete this task ?', ok => {
        if(ok){
          firebase.remove(`tasks/${id}`, () => {
            History.log(firebase, History.EVENT.DELETE, 'task', id,contact, task.name )
          })
        }
      })
    }

    const filterResult = event => {
      const filter = this.refs.filter.value.toLowerCase()
      this.state.filter = filter
      this.setState(this.state)
    }

    const handleFilterFromDate = val => {
      this.state.fromDate = this.refs.fromDate.state.selectedDate
      this.setState(this.state)
    }

    const handleFilterToDate = val => {
      this.state.toDate = this.refs.toDate.state.selectedDate
      this.setState(this.state)
    }

    const handleChangePage = page => {
      this.state.currentPage = page
      this.setState(this.state)
    }

    const handleTypeChange = (level) => event => {
      let type = MTasks.processType(this.state.type)
      type[level] = event.target.value

      if ( type[level+1] ) type[level+1] = 'none'
      if ( type[level+2] ) type[level+2] = 'none'

      this.state.type = type

      this.setState(this.state)
    }

    const setFromDate = (event) => {
      const {fromDate} = this.refs

      this.state.fromDate = fromDate.value
      this.setState(this.state)
    }

    const types = MTasks.getTypes()

    const renderSelect = (options, value, level) => {
      const opts = _.map(options, opt => (<option value={opt.id} key={value+opt.id}>{opt.text}</option>))

      return (<div key={value}><div  className="form-group"><select defaultValue={value} onChange={handleTypeChange(level)} className="form-control">{opts}</select></div></div>)
    }

    const renderTaskType = type => {
      const typeRender = []

      const options1 = renderSelect(types, type[0], 0)
      typeRender.push(options1)

      const types1 = MTasks.getTypeById(types,type[0]).childs
      if(types1){
        const options2 = renderSelect(types1, type[1], 1)
        typeRender.push(options2)
      }

      const types2 = MTasks.getTypeById(types1,type[1]).childs
      if(types2){
        const options3 = renderSelect(types2, type[2], 2)
        typeRender.push(options3)
      }

      return typeRender
    }

    const selectedType = MTasks.processType( this.state.type )

    const remapTasks = _.map(tasks, (task, id) => ({_id:id, ...task}))

    // const filteredTasks = _.filter(remapTasks, task => !( this.state.filter && task.name.toLowerCase().indexOf(this.state.filter) == -1 ));

    const filteredTasks = _(remapTasks)
      .filter(task => !(this.state.filter && task.name.toLowerCase().indexOf(this.state.filter) == -1) )
      .filter( task => {
        const idx = _.findLastIndex(selectedType, type => type && type!== 'none' )
        if(idx < 0) return true

        return _.isEqual(
          _.filter(selectedType, (t, i) => i<= idx),
          _.filter(task.type, (t,i) => i<=idx))

      } )
      .filter( task => {
        const duedate = moment(task.duedate, 'MM-DD-YYYY')
        const {fromDate, toDate } = this.state
        if(fromDate && duedate.isBefore(fromDate, 'day')){
          return false
        }
        if(toDate && duedate.isAfter(toDate, 'day')){
          return false
        }

        return true
      } )
      .value()


    const pagedTasks = _.filter(filteredTasks, (task, idx) =>  (currentPage-1)*perPage  <= idx && idx <= currentPage * perPage)

    const tasksList = _(pagedTasks)
      .map( task => {
       const typeName=MTasks.getTypeById(MTasks.getTypes(), task.type[0]).text
        return {...task, typeName}
      })
      .map( task => (
        <tr key={task._id} >
            <td>{task.duedate}</td>
            <td>{task.typeName}</td>
            <td>{task.name}</td>
            <td>{task.notes}</td>
            <td>
              <Link to={'/tasks/edit/' + task._id} className="edit-row btn btn-sm">
                <i className="fa fa-edit"></i> View
              </Link>&nbsp;
              <a onClick={handleDelete(task._id)} className="delete-row btn btn-sm">
                <i className="fa fa-times"></i> Delete
              </a>
            </td>
          </tr>
        ) )
      .value()

    return (
      <div id="tasks-list">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Tasks</h1>
              <span className="mainDescription">all tasks</span>
            </div>
            <div className="col-sm-5">
              <Link to="/tasks/add"><button className="btn btn-green add-row margin-top-15 pull-right">
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
                    <label>Filter by Task Name&nbsp;</label>
                    <input className="form-control" type="text" name="filter" id="filter" ref="filter" onChange={filterResult} />
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="table-filter form-group">
                    <label>Filter by Task Type&nbsp;</label>
                      { renderTaskType( selectedType ) }
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="table-filter form-group">
                    <label>Filter by Time&nbsp;</label>
                    <div className="row">
                      <div className="col-sm-6">
                        <DateTimeField placeholder="" inputFormat="MM-DD-YYYY" ref="fromDate" mode="date" showToday={true} onChange={handleFilterFromDate} defaultText={(this.state.fromDate) ?  this.state.fromDate.format('MM-DD-YYYY'): ''}/>
                      </div>
                      <div className="col-sm-6">
                        <DateTimeField placeholder="" inputFormat="MM-DD-YYYY" ref="toDate" mode="date" showToday={true} onChange={handleFilterToDate} defaultText={(this.state.toDate) ?  this.state.toDate.format('MM-DD-YYYY'): ''}/>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover" id="sample_2">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th>Type</th>
                      <th>Task</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasksList}
                  </tbody>
                </table>
                <Pagination items={filteredTasks.length} perPage={perPage} currentPage={currentPage} onPageChange={handleChangePage}/>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }

}

