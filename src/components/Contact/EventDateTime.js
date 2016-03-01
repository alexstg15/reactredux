
import React, {Component} from 'react'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'


export default
class EventDateTime extends Component {
    constructor() {
        super()
        this.state = {times:[], date: null}
        const nextWed = (moment().day(3).isSameOrAfter(moment())) ? moment().day(3) : moment().day(10)
        const nextThu = (moment().day(4).isSameOrAfter(moment())) ? moment().day(4) : moment().day(11)

        const nextDate = (nextThu.isBefore(nextWed)) ? nextThu : nextWed

        this.state.date = nextDate

        this.getTimes()
    }

    getTimes(){
      const day = this.state.date.day()
      this.state.times = (day===3) ? [9,10] : [10,11]
    }

    componentWillMount(){
      const {defaultDate} = this.props

      if(defaultDate==='empty'){
        this.state.date=''
      }

      const time = `${moment(this.state.date).format('MM-DD-YYYY')} ${this.state.times[0]}:00 PM`
      if(this.props.onChange){
        console.odd
        this.props.onChange(time)
      }
    }

    render() {

        const setTimes = event => {
            this.state.date = moment(parseInt(event))
            this.getTimes()
            this.setState(this.state)
            const hour = this.refs.time.value
            const time = `${moment(this.state.date).format('MM-DD-YYYY')} ${hour}:00 PM`
            if(this.props.onChange){
              this.props.onChange(time)
            }
        }

        const setHour = event => {
            const hour = this.refs.time.value
            const time = `${moment(this.state.date).format('MM-DD-YYYY')} ${hour}:00 PM`
            if(this.props.onChange){
              this.props.onChange(time)
            }
        }

        const times = this.state.times.map( t => (<option key={t} value={t}>{t} PM</option>) )

        const formatedDate = (this.state.date === '') ? '' : this.state.date.format('MM-DD-YYYY')

        return (
          <div className="row">
            <div className="col-md-6">
              <DateTimeField placeholder="" ref="day" inputFormat="MM-DD-YYYY"
                defaultText={formatedDate}
                inputProps={{id: "day", name: "day" }}
                mode='date'
                daysOfWeekDisabled={[0,1,2,5,6]}
                onChange={setTimes}
              />
            </div>
            <div className="col-md-6">
              <select
                ref="time"
                className="form-control margin-bottom-15" onChange={setHour}>
                {/* <option>-- Select Times --</option> */}
                {times}
              </select>
            </div>
          </div>
        )
    }
}

