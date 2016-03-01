import React, {Component} from 'react'
import {firebase, helpers} from 'redux-react-firebase'
import {connect} from 'react-redux'
import DateTimeField from 'react-bootstrap-datetimepicker'
import _ from 'lodash'
import EventDateTime from './EventDateTime'
import moment from 'moment'

import * as History from '../../models/History'

const {dataToJS, isLoaded} = helpers

export default
@firebase([
  'contacts'
])
@connect(
  ({firebase}) => ({
    contacts: dataToJS(firebase, 'contacts')
  })
)
class ContactAddInnerAnimalDetailsModal extends Component {
  constructor(){
    super()
    this.defaultState = {
      type:'',

      animals: {
        foot:{text: 'Foot', animals:['','',''], date: ''},
        root:{text: 'Root', animals:['','',''], date: ''},
        sacral:{text: 'Sacral', animals:['','',''], date: ''},
        solarplexus:{text: 'Solar Plexus', animals:['','',''], date: ''},
        heart:{text: 'Heart', animals:['','',''], date: ''},
        throat:{text: 'Throat', animals:['','',''], date: ''},
        thirdeye:{text: 'Third Eye', animals:['','',''], date: ''},
        crown:{text: 'Crown', animals:['','',''], date: ''},
      }
    }

    // this.state = _.cloneDeep(this.defaultState)
  }

  render() {

    const {dispatch, id, firebase, contacts} = this.props

    if(!this.state) {
      if(this.props.courseId){
        this.state = contacts[id].courses[this.props.courseId]
      } else {
        this.state = _.cloneDeep(this.defaultState)
      }

    }


    const changeType = type => event => {
      this.state.type = type
    }

    const changeAnimal = (type, idx) => event => {
      this.state.animals[type].animals[idx] = event.target.value
    }

    const changeDate = id => date => {
      this.state.animals[id].date = moment(date, 'x').format('MM-DD-YYYY hh:mm A')
    }


    const handleSubmit = event => {
      const course = {
        type: this.state.type,
        animals: this.state.animals
      }
      let courseId = this.props.courseId
      if(courseId){
        const events = _.each(contacts[id].events, (e,eId) => {
          if(e.course == courseId){
            firebase.remove(`contacts/${id}/events/${eId}`)
          }
        })
        firebase.set(`contacts/${id}/courses/${courseId}`, course, () => {
          History.log(firebase, History.EVENT.UPDATE, 'course', courseId, id, 'Inner Animal')
        })
      } else {
        courseId = firebase.push(`contacts/${id}/courses`, course).name()
        History.log(firebase, History.EVENT.ADD, 'course', courseId, id, 'Inner Animal')
      }
      const type='1'
      let text = 'Inner animal'
      _.each(this.state.animals, a => {
        if(a.date) {
          firebase.push(`contacts/${id}/events`, {type, time:a.date, text, course:courseId})
        }
      })
      // this.state = _.cloneDeep(this.defaultState)
      this.props.onSubmit()
    }

    const animalsList = _.map(this.state.animals, (row, id) => {
      const a = row.animals.map( (an, idx) => (
          <div key={id+'_'+idx} className="col-md-2">
            <input type="text" placeholder={`Animal ${idx+1}`} className="form-control"
              defaultValue={an} onChange={changeAnimal(id, idx)}/>
          </div>
      ))
      const date = row.date ? row.date : ''
      return(
        <div  key={id} className="form-group clearfix">
          <label className="control-label col-md-2">{row.text}</label>
          {a}
          <div className="col-md-4">
            <div className="input-group form_meridian_datetime">
              {/* <EventDateTime onChange={changeDate(id)} defaultDate={date}/> */}
              <DateTimeField placeholder=""  inputFormat="MM-DD-YYYY hh:mm A"
                defaultText={date}
                inputProps={{id: "day", name: "day" }}
                mode='datetime'
                onChange={changeDate(id)}
              />
            </div>
          </div>
        </div>
      )
    })

    return (
      <div>

        <div className="col-md-12">
          <fieldset>
            <legend>Inner Animal Details</legend>
            <h5>Event Type</h5>
            <div className="radio clip-radio radio-primary radio-inline">
              <input type="radio" id="workshop_location_virtual" name="workshop_location" value='virtual' onClick={changeType('virtual')}/>
              <label htmlFor="workshop_location_virtual">
                Virtual
              </label>
            </div>
            <div className="radio clip-radio radio-primary radio-inline">
              <input type="radio" id="workshop_location_person" name="workshop_location" value='inperson' onClick={changeType('inperson')}/>
              <label htmlFor="workshop_location_person">
                In Person
              </label>
            </div>
            <h5>Dates and Animals</h5>
            {animalsList}
          </fieldset>
        </div>


        <div className="row">
          <div className="col-md-12">
            <button onClick={handleSubmit} data-dismiss="modal" className="btn btn-wide btn-success margin-right-15">
              Save changes
            </button>
            <button type="reset" data-dismiss="modal" className="btn btn-o btn-wide btn-default">Close</button>
          </div>
        </div>

      </div>
    )
  }
}
