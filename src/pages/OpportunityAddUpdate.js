import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {pushState} from 'redux-router'
import _ from 'lodash'
import {fromJS, toJS} from 'immutable'
import * as Opportunities from '../models/Opportunities'
import DateTimeField from 'react-bootstrap-datetimepicker'
import {firebase, helpers} from 'redux-react-firebase'
import {removeFalsies} from '../lib/utils'
import * as History from '../models/History'

const {dataToJS} = helpers

export default
@firebase([
  'contacts'
])
@connect(
  ({firebase}) => ({
    opportunities: dataToJS(firebase, 'opportunities'),
    contacts: dataToJS(firebase, 'contacts')
  })
)
class OpportunityAdd extends Component {
  constructor() {
    super()
    this.state = {type: null, contact: null}
  }

  componentDidMount() {
    const {opportunities, dispatch, params} = this.props
    const id = ((params && params.id) ? params.id : ((this.props.id) ? this.props.id : null))
    const linkToContact = (params && params.contact) ? linkToContact = params.contact : ''
    const opportunity = (id) ? opportunities[id] : {
      name: '',
      stage: '',
      forf: '',
      type: '',
      nextAction: '',
      notes: '',
      linkToContact: linkToContact,
      contact: '',
    }

    this.state.contact = (opportunity.contact) ? (opportunity.contact) : {
      ndc: {yes_or_no: '', date_completed: ''},
      presentation: {yes_or_no: '', date_completed: ''},
      enrolled: {yes_or_no: '', date_completed: ''},
      contactAgreementOut: {yes_or_no: '', date_out: '', date_due: ''},
      contactAgreementIn: {yes_or_no: '', date_due: '', date_in: ''},
      firstPay: {date_entry: '', date_received: ''}
    }

    this.state.type = opportunity.type;
    this.setState(this.state);
  }

  render() {
    const {opportunities, contacts, dispatch, params, firebase} = this.props

    const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )

    const handleSubmit = event => {
      const {
        opportunityName,
        stage,
        forf,
        type,
        nextAction,
        notes,
        linkToContact,
        } = this.refs

      const contactsubData = {
        ndc:{yes_or_no:this.state.contact.ndc.yes_or_no, date_completed:$("#ndc_complete").val()},
        presentation:{yes_or_no:this.state.contact.presentation.yes_or_no, date_completed:$("#presentation_complete").val()},
        enrolled:{yes_or_no:this.state.contact.enrolled.yes_or_no, date_completed:$("#enrolled_complete").val()},
        contactAgreementOut:{yes_or_no:this.state.contact.contactAgreementOut.yes_or_no, date_out:$("#contactAgreementOut_dateOut").val(), date_due:$("#contactAgreementOut_dateDue").val()},
        contactAgreementIn:{yes_or_no:this.state.contact.contactAgreementIn.yes_or_no, date_due:$("#contactAgreementIn_dateDue").val(), date_in:$("#contactAgreementIn_dateIn").val()},
        firstPay:{date_entry:$("#payFirst_dateEntry").val(), date_received:$("#payFirst_dateReceived").val()}
      }


      const opportunity = removeFalsies({
        name: opportunityName.value ,
        stage : stage.value ,
        forf    : forf.value ,
        type : type.value,
        nextAction    : nextAction.value ,
        notes  : notes.value ,
        linkToContact     : linkToContact.value ,
        contact :contactsubData
      })

      if (id) {
        firebase.set(`opportunities/${id}`, opportunity, () => {
          History.log(firebase, History.EVENT.UPDATE, 'opportunity', id, opportunity.linkToContact, opportunity.name)
        })
      } else {
        const newOp = firebase.push(`opportunities`, opportunity, () => {
          History.log(firebase, History.EVENT.ADD, 'opportunity', newOp.name(),opportunity.linkToContact, opportunity.name)
        })
      }
      dispatch(pushState(null, '/opportunities'))
    }

    const linkToContact = (params && params.contact) ? params.contact : ''
    const opportunity = (id) ? opportunities[id] : {
      name: '',
      stage: '',
      forf: '',
      type: '',
      nextAction: '',
      notes: '',
      linkToContact: linkToContact
    }

    const handleTypeChange = () => event => {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.name == 'type') {
        this.state.type = event.target.value
        this.setState(this.state)
      }

      return false;
    }

    const handleRadioChange = () => event => {
      // console.log(event.target.name)
      if (event.target.name == "ndc") {
        this.state.contact.ndc.yes_or_no = event.target.value
        console.log(this.state.contact.ndc)
        this.setState(this.state)
      }

      if (event.target.name == "enrolled") {
        this.state.contact.enrolled.yes_or_no = event.target.value
        console.log(this.state.contact.enrolled)
        this.setState(this.state)
      }
      if (event.target.name == "contactAgreementOut") {
        this.state.contact.contactAgreementOut.yes_or_no = event.target.value
        console.log(this.state.contact.contactAGOut)
        this.setState(this.state)
      }
      if (event.target.name == "contactAgreementIn") {
        this.state.contact.contactAgreementIn.yes_or_no = event.target.value
        console.log(this.state.contact.contactAGIn)
        this.setState(this.state)
      }
      if (event.target.name == "presentation") {
        this.state.contact.presentation.yes_or_no = event.target.value
        console.log(this.state.contact.presentation)
        this.setState(this.state)
      }
    }

    const handleDateTimeChange = () => event => {
      // console.log(event.target.name)
    }

    const stages = Opportunities.getStages()
    const forfs = Opportunities.getFors()
    const types = Opportunities.getTypes()

    const renderSelect = (options, value, title) => {
      const opts = _.map(options, opt => (<option value={opt.id} key={opt.id}>{opt.text}</option>))

      return (
        <div className="form-group"><select defaultValue={value} onChange={handleTypeChange()} className="form-control"
                                            name={title} ref={title}>{opts}</select></div>)
    }

    const renderSelectContact = _.map(contacts, (contact, id) => (<option key={id} value={id}>{contact.firstName + ' ' +contact.lastName}</option>))

    const subCollection = (value) => {
      if (value == 'contact') {
        return (
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-3">NDC</div>
              <div className="col-md-3">
                <input type="radio" name="ndc" value="yes"
                       checked={(this.state.contact.ndc.yes_or_no)?(this.state.contact.ndc.yes_or_no === "yes"):''}
                       onChange={handleRadioChange()}/>Yes
                <input type="radio" name="ndc" value="no"
                       checked={(this.state.contact.ndc.yes_or_no)?(this.state.contact.ndc.yes_or_no === "no"):''}
                       onChange={handleRadioChange()}/>No
              </div>
              <div className="col-md-3">
                <label>Date Completed</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.ndc.date_completed}
                               inputProps={{id: "ndc_complete", name: "ndc_complete" }} ref="ndcComplete"/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">Presentation</div>
              <div className="col-md-3">
                <input type="radio" name="presentation" value="yes"
                       checked={this.state.contact.presentation.yes_or_no=="yes"} onChange={handleRadioChange()}/>Yes
                <input type="radio" name="presentation" value="no"
                       checked={this.state.contact.presentation.yes_or_no=="no"} onChange={handleRadioChange()}/>No
              </div>
              <div className="col-md-3">
                <label>Date Completed</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A"
                               defaultText={this.state.contact.presentation.date_completed}
                               inputProps={{id: "presentation_complete", name: "presentation_complete" }}
                               ref="presentationComplete"/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">Enrolled</div>
              <div className="col-md-3">
                <input type="radio" name="enrolled" value="yes" checked={this.state.contact.enrolled.yes_or_no=="yes"}
                       onChange={handleRadioChange()}/>Yes
                <input type="radio" name="enrolled" value="no" checked={this.state.contact.enrolled.yes_or_no=="no"}
                       onChange={handleRadioChange()}/>No
              </div>
              <div className="col-md-3">
                <label>Date Completed</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.enrolled.date_completed}
                               inputProps={{id: "enrolled_complete", name: "enrolled_complete" }}
                               ref="enrolledComplete"/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">Contact Agreement Out</div>
              <div className="col-md-3">
                <input type="radio" name="contactAgreementOut" value="yes"
                       checked={this.state.contact.contactAgreementOut.yes_or_no=="yes"} onChange={handleRadioChange()}/>Yes
                <input type="radio" name="contactAgreementOut" value="no"
                       checked={this.state.contact.contactAgreementOut.yes_or_no=="no"} onChange={handleRadioChange()}/>No
              </div>
              <div className="col-md-3">
                <label>Date Out</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A"
                               defaultText={this.state.contact.contactAgreementOut.date_out}
                               inputProps={{id: "contactAgreementOut_dateOut", name: "contactAgreementOut_dateOut" }}
                               ref="contactAgreementOutDateOut"/>
              </div>
              <div className="col-md-3">
                <label>Date Due</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A"
                               defaultText={this.state.contact.contactAgreementOut.date_due}
                               inputProps={{id: "contactAgreementOut_dateDue", name: "contactAgreementOut_dateDue" }}
                               ref="contactAgreementOutDateDue"/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">Contact Agreement In</div>
              <div className="col-md-3">
                <input type="radio" name="contactAgreementIn" value="yes"
                       checked={this.state.contact.contactAgreementIn.yes_or_no=="yes"}
                       onChange={handleRadioChange()}>Yes</input>
                <input type="radio" name="contactAgreementIn" value="no"
                       checked={this.state.contact.contactAgreementIn.yes_or_no=="no"}
                       onChange={handleRadioChange()}>No</input>
              </div>
              <div className="col-md-3">
                <label>Date Out</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.contactAgreementIn.date_due}
                               inputProps={{id: "contactAgreementIn_dateDue", name: "contactAgreementIn_dateDue" }}
                               ref="contactAgreementInDateDue"/>
              </div>
              <div className="col-md-3">
                <label>Date Due</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.contactAgreementIn.date_in}
                               inputProps={{id: "contactAgreementIn_dateIn", name: "contactAgreementIn_dateIn" }}
                               ref="contactAgreementInDateIn"/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">1st Pay</div>
              <div className="col-md-3"></div>
              <div className="col-md-3">
                <label>Date Entry</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.firstPay.date_entry}
                               inputProps={{id: "payFirst_dateEntry", name: "payFirst_dateEntry" }}
                               ref="payFirstDateEntry"/>
              </div>
              <div className="col-md-3">
                <label>Date Received</label>
                <DateTimeField inputFormat="MM-DD-YYYY h:m A" defaultText={this.state.contact.firstPay.date_received}
                               inputProps={{id: "payFirst_dateReceived", name: "payFirst_dateReceived" }}
                               ref="payFirstDateReceived"/>
              </div>
            </div>
          </div>
        )
      }
      return ('')
    }

    return (
      <div id="contact-add">
        <section id="page-title" className="padding-top-15 padding-bottom-15">
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Opportunity</h1>
              <span className="mainDescription">{id ? "Edit Opportunity" : "Add a New Opportunity"}</span>
            </div>
          </div>
        </section>
        <div className="container-fluid container-fullw bg-white">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunity Name<span className="required">*</span></label>
                <div className="col-md-4">
                  <input type="text" className="form-control" name="opportunityName" ref="opportunityName"
                         defaultValue={opportunity.name}/>
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunity Stage<span className="required">*</span></label>
                <div className="col-md-4">
                  {renderSelect(stages, opportunity.stage, 'stage')}
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunty For<span className="required">*</span></label>
                <div className="col-md-4">
                  {renderSelect(forfs, opportunity.forf, 'forf')}
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunity type<span className="required">*</span></label>
                <div className="col-md-4">
                  {renderSelect(types, opportunity.type, 'type')}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-8 col-md-offset-3">{subCollection(this.state.type)}</div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunity Next Action Date<span
                  className="required">*</span></label>
                <div className="col-md-4">
                  <DateTimeField  placeholder="" inputFormat="MM-DD-YYYY" defaultText={opportunity.nextAction} inputProps={{id: "task_datetime", name: "nextAction" }} ref="nextAction" />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Opportunity notes<span className="required">*</span></label>
                <div className="col-md-4">
                  <input type="text" className="form-control" name="notes" ref="notes"
                         defaultValue={opportunity.notes}/>
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-3">Link to Contact<span className="required">*</span></label>
                <div className="col-md-4">

                <select ref="linkToContact" className="form-control" defaultValue={opportunity.linkToContact}>
                  <option value="">Select a contact</option>
                  {renderSelectContact}
                </select>
                </div>
              </div>
              <div className="form-actions fluid row">
                <div className="col-md-offset-3 col-md-8 margin-top-15">
                  <button onClick={handleSubmit} type="submit" className="btn btn-wide btn-success margin-right-15">
                    Submit
                  </button>

                </div>
              </div>
            </div>
            { /* col-md-12 */ }
          </div>
          { /* row */ }
        </div>
      </div>
    )
  }

  //componentWillReceiveProps(nextProps) {
  //  const {opportunities, dispatch, params} = this.props
  //  const id = ((params && params.id) ? params.id : ((this.props.id) ? this.props.id : null ))
  //  const opportunity = (id) ? opportunities[id] : {
  //    name: '',
  //    stage: '',
  //    forf: '',
  //    type: '',
  //    nextAction: '',
  //    notes: '',
  //    linkToContact: '',
  //  }
  //  this.state.type = opportunity.type;
  //  this.setState(this.state)
  //}
}

