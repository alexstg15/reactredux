import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {pushState} from 'redux-router'
import _ from 'lodash'
import {firebase, helpers} from 'redux-react-firebase'
import * as Tasks from '../models/Tasks'
import DateTimeField from 'react-bootstrap-datetimepicker'

import * as History from '../models/History'

const {dataToJS} = helpers

export default
@firebase([
  'contacts'
])
@connect(
  ({firebase}) => ({
    tasks: dataToJS(firebase, 'tasks'),
    contacts: dataToJS(firebase, 'contacts')
  })
)
class TasksAdd extends Component {
  constructor() {
    super()
    this.state = {type: null, contact: null, formError:null, name: null}
  }

  componentDidMount() {
    const {tasks, dispatch, params} = this.props
    const id = ((params && params.id) ? params.id : ((this.props.id) ? this.props.id : null))
    const linkToContact = (params && params.contact) ? linkToContact = params.contact : ''
    const task = (tasks && id) ? tasks[id] : {
      name: '',
      duedate: '',
      notes: '',
      linkToContact: linkToContact,
      type: null
    }

    const selectedType = Tasks.processType(this.state.type || task.type)

    this.state.type = selectedType;
    this.setState(this.state);
  }

  render() {
    const {tasks, contacts, dispatch, params, firebase} = this.props

    const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )

    const handleSubmit = event => {
      const {
        name,
        duedate,
        notes,
        linkToContact
        } = this.refs

      //if (!this.validateForm(this.refs)) {
      //  return false;
      //}

      const task = {
        name: name.value,
        duedate: duedate.state.inputValue,
        notes: notes.value,
        type: Tasks.processType(this.state.type),
        linkToContact: linkToContact.value
      }

      if(!name.value) {
        this.state.formError = 'Please complete name'
        return this.setState(this.state)
      }

      if (id) {
        firebase.set(`tasks/${id}`, task, () => {
          History.log(firebase, History.EVENT.UPDATE, 'task', id, task.linkToContact, task.name)
        })
      } else {
        const newTask = firebase.push(`tasks`, task, () => {
          History.log(firebase, History.EVENT.ADD, 'task', newTask.name(),task.linkToContact, task.name)
        })
      }

      dispatch(pushState(null, '/tasks'))
    }


    const handleTypeChange = (level) => event => {
      let type = Tasks.processType(this.state.type)
      type[level] = event.target.value

      if (type[level + 1]) type[level + 1] = 'none'
      if (type[level + 2]) type[level + 2] = 'none'

      this.state.type = type

      this.setState(this.state)
    }

    const handleDateTimeChange = () => event => {
      this.state.duedate = event.target.value
      this.setState(this.state)
    }

    const linkToContact = (params && params.contact) ? params.contact : ''
    const task = (id) ? tasks[id] : {
      name: '',
      duedate: '',
      notes: '',
      linkToContact: linkToContact,
      type: null
    }

    const renderSelect = (options, value, level) => {
      const opts = _.map(options, opt => (<option value={opt.id} key={opt.id}>{opt.text}</option>))

      return (<div className="col-sm-4 col-md-3">
        <div key={value} className="form-group"><select defaultValue={value} onChange={handleTypeChange(level)}
                                                        className="form-control">{opts}</select></div>
      </div>)
    }

    const types = Tasks.getTypes()

    const selectedType = Tasks.processType(this.state.type || task.type)

    const renderTaskType = type => {
      const typeRender = []

      const options1 = renderSelect(types, type[0], 0)
      typeRender.push(options1)

      const types1 = Tasks.getTypeById(types, type[0]).childs
      if (types1) {
        const options2 = renderSelect(types1, type[1], 1)
        typeRender.push(options2)
      }

      const types2 = Tasks.getTypeById(types1, type[1]).childs
      if (types2) {
        const options3 = renderSelect(types2, type[2], 2)
        typeRender.push(options3)
      }

      return typeRender
    }

    const renderSelectContact = _.map(contacts, (contact, id) => (
      <option key={id} value={id}>{contact.firstName + ' ' + contact.lastName}</option>))


    return (
      <div id="add-update-tasks">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Tasks</h1>
              <span className="mainDescription">{id ? "edit a task" : "add a new task"}</span>
            </div>
            <div className="col-sm-5">
            </div>
          </div>
        </section>
        <div className="container-fluid container-fullw bg-white">
          <div className="row">
            <div className="col-lg-8 col-sm-12">
              <div className="form-group">
                <label htmlFor="">
                  What needs to be done?
                  {this.state.formError}
                </label>
                <input type="text" className="form-control" name="task_name" ref="name"
                       placeholder="Task Title" defaultValue={task.name}/>
              </div>
            </div>
            <div className="col-lg-4 col-sm-12">
              <div className="form-group">
                <label htmlFor="">
                  When is it due?
                </label>
                <div className="form-group">
                  <DateTimeField placeholder="" inputFormat="MM-DD-YYYY" defaultText={task.duedate}
                                 inputProps={{id: "task_datetime", name: "task_datetime" }} ref="duedate" mode="date" showToday="true"/>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group task-types">
                <label htmlFor="">
                  What type of task is it?
                </label>
                <div className="row">
                  <div className="col-sm-8">
                    <div className="row">
                      {renderTaskType(selectedType)}
                    </div>
                  </div>
                  <div className="col-sm-4 form-group">
                    <select ref="linkToContact" className="form-control" defaultValue={task.linkToContact}>
                      <option value="">Select a contact</option>
                      {renderSelectContact}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="">
              Any notes?
            </label>
            <div className="note-editor">
              <textarea className="form-control autosize area-animated" name="task_notes" ref="notes"
                        defaultValue={task.notes}></textarea>
            </div>
          </div>
          <div className="margin-top-15">
            <button onClick={handleSubmit} type="submit" className="btn btn-wide btn-success margin-right-15">Submit
            </button>
            <Link to="/tasks">
              <button type="reset" className="btn btn-o btn-wide btn-default">Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  validateForm(refs) { // use if jquery, not advised
    const {name, duedate, notes} = this.refs;

    var isvalid = true;

    $(".ui-input_state_invalid").removeClass('ui-input_state_invalid');
    if (name.value == '') {
      $(name).addClass('ui-input_state_invalid');
      isvalid = false;
    }

    if (duedate.state.inputValue == '') {
      $(duedate.refs.datetimepicker).find("#task_datetime").addClass('ui-input_state_invalid');
      isvalid = false;
    }

    if (notes.value == '') {
      $(notes).addClass('ui-input_state_invalid');
      isvalid = false;
    }

    var hasnone = false;
    var type = Tasks.processType(this.state.type);

    type.forEach(function (n) {
      if (n == 'none') hasnone = true;
    });
    if (hasnone) {
      $(".task-types").find('select.form-control').addClass('ui-input_state_invalid');
      isvalid = false;
    }

    return isvalid;
  }

  componentWillReceiveProps(nextProps) {
    const {tasks, dispatch, params} = nextProps
    const id = (params) ? params.id : null
    const task = (id) ? tasks[id] : {name: '', duedate: '', notes: '', type: null}

    this.refs.name.value = task.name;
    this.refs.notes.value = task.notes;
    this.refs.duedate.setState({inputValue: task.duedate});

    const selectedType = Tasks.processType(task.type)

    this.state.type = selectedType;
    this.setState(this.state);

    $("#task_datetime").val(task.duedate);
  }
}


