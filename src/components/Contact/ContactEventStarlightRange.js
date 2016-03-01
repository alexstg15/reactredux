import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firebase} from 'redux-react-firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'

import * as History from '../../models/History'

export default
@firebase()
@connect()
class ContactEventStarlight extends Component {
  constructor() {
    super()
    this.state = {type: 1, day: 3, times:null}
    this.getTimes()
  }


  getTimes(){
    this.state.times = (this.state.day===3) ? [9,10] : [10,11]
  }


  render() {

    const handleSubmit = () => {

      const {fromDate, toDate, day, time} = this.refs

      const event = {
        fromDate: fromDate.state.inputValue,
        toDate: toDate.state.inputValue,
        day: parseInt(day.value),
        time: time.value
      }

      const startDate = moment(event.fromDate, 'MM-DD-YYYY')
      const endDate = moment(event.toDate, 'MM-DD-YYYY')


      let date = startDate
      let eventtime
      while(date.isSameOrBefore(endDate)){
        if(date.day()===event.day){

          const type = '1'
          const text = 'Starlight energy'
          eventtime = `${date.format('MM-DD-YYYY')} ${event.time}:00 PM`
          const newEvent = this.props.firebase.push(`contacts/${this.props.id}/events`, {type, time: eventtime, text}, () => {
            History.log(this.props.firebase, History.EVENT.ADD, 'event', newEvent.name(), this.props.id, text)
          })
        }
        date = date.add(1, 'day')
      }

      this.props.onSubmit()
    }

    const changeDay = () => {
      this.state.day = parseInt(this.refs.day.value)
      this.getTimes()
      this.setState(this.state)
    }

    this.getTimes()

    const timesList = this.state.times.map( t => (<option key={t} value={t}>{t} PM</option>) )

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <fieldset>
              <legend>Starlight Energy Included Sessions</legend>
              <div className="row">
                <div className="col-md-4">
                  <h5 >Date Range</h5>
                </div>
                <div className="col-md-4">
                  <h5>Weekly Sessions</h5>
                </div>
                <div className="col-md-4">

              </div></div>
              <div className="row">
                <div className="col-md-4">
                  <div className="input-group input-daterange datepicker">
                    <DateTimeField placeholder="" ref="fromDate" inputFormat="MM-DD-YYYY"
                      inputProps={{id: "fromDate", name: "fromDate" }}
                      mode='date'
                    />
                    <span className="input-group-addon bg-primary">to</span>
                    <DateTimeField placeholder="" ref="toDate" inputFormat="MM-DD-YYYY"
                      inputProps={{id: "toDate", name: "toDate" }}
                      mode='date'
                    />
                  </div>
                </div>
                <div className="col-md-4">

                  <select id="course_day" name="course_day" ref='day' onChange={changeDay} className="form-control">
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select id="course_time" name="course_time" ref='time' className="form-control">
                    {timesList}
                  </select>
                </div>
              </div>
            </fieldset>
          </div>
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

