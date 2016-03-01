import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import _ from 'lodash'



import {firebase, helpers} from 'redux-react-firebase'
import moment from  'moment'
import Pagination from '../components/Pagination'

import * as MTasks from '../models/Tasks'

const {dataToJS} = helpers

export default
@firebase([
  ['tasks'],
])
@connect(
  ({firebase}) => ({
    tasks: dataToJS(firebase, 'tasks'),
  })
)

class TodayTasks extends React.Component {

  constructor() {
    super()
    this.state = { currentPage: 1, perPage: 10, type: null}
  }

  render() {

    const {tasks} = this.props

    const {perPage, currentPage} = this.state

    const handleChangePage = page => {
      this.state.currentPage = page
      this.setState(this.state)
    }

    const types = MTasks.getTypes()

    const selectedType = MTasks.processType(this.state.type)

    const remapTasks = _.map(tasks, (task, id) => ({_id: id, ...task}))


    const filteredTasks = _.filter(remapTasks, task => {
      let filter1 = this.state.filter && task.name.toLowerCase().indexOf(this.state.filter) == -1
      let filter2 = 0;

      _.forEach(task.type, (value, key) => {

        if (selectedType[key] == undefined) filter2++;
        else if (selectedType[key] == 'none') filter2++
        else if (selectedType[key] == value) filter2++

      })

      return !filter1 && (filter2 == task.type.length)
    })
    const dueDateTasks = _.filter(filteredTasks, task => {
      const dueDate = moment(task.duedate)
      const isToday = dueDate.isSameOrBefore(moment().add(7,'days'), 'day')
      return isToday
    })

    const sortedTasks = _.sortBy( dueDateTasks, task => {
      const date = moment(task.duedate).unix()
      return date
    } )

    const pagedTasks = _.filter(sortedTasks, (task, idx) =>  (currentPage - 1) * perPage <= idx && idx <= currentPage * perPage)

    const tasksList = _.map(sortedTasks, task =>  {
        let colorClass = ''
        const duedate = moment(task.duedate, 'MM-DD-YYYY')

        colorClass = duedate.isSame(moment(), 'day') ? 'success' : colorClass
        colorClass = duedate.isBefore(moment(), 'day') ? 'danger' : colorClass

        return (
          <tr key={task._id} className={colorClass}>
            <td>{task.name}</td>
            <td>{task.notes}</td>
            <td>
              <Link to={'/tasks/edit/' + task._id} className="edit-row btn btn-sm">
                <i className="fa fa-edit"></i> View
              </Link>

            </td>
          </tr>
        )
      }
    )

    return (

              <div className="panel panel-white">
                <div className="panel-heading">
                  <div className="panel-title">
                    Today's Tasks
                  </div>
                </div>
                <div className="panel-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-condensed" id="tasks_list">
                      <thead>
                      <tr>
                        <th>Task</th>
                        <th>Description</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      {tasksList}
                      </tbody>
                    </table>
                    <Pagination items={pagedTasks.length} perPage={perPage} currentPage={currentPage}
                                onPageChange={handleChangePage}/>
                  </div>
                </div>
              </div>


    )
  }
}
