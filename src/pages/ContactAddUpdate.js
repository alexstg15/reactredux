import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {pushState} from 'redux-router'
import _ from 'lodash'
import {firebase, helpers} from 'redux-react-firebase'
import DateTimeField from 'react-bootstrap-datetimepicker'
import Select from 'react-select'

import * as History from '../models/History'

const {dataToJS} = helpers

export default
@firebase([
  'companies'
])
@connect(
  ({firebase}) => ({
    companies: dataToJS(firebase, 'companies'),
    contacts: dataToJS(firebase, 'contacts'),
  })
)
class ContactAddUpdate extends Component {
  constructor(){
    super()
    this.state = {}
  }

  render() {
    const {contacts, dispatch, params, firebase, companies} = this.props

    const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )

    const handleSubmit = event => {
      event.preventDefault();
      event.stopPropagation();

      const {
        firstName, lastName,
        email, phone,
        address, city, state, zip,
        birthdate,
        referral, website, fax,
        phonetype1, phonetype2, phone1, phone2,
        title,
        facebook, linkedin, twitter, google, ning,
        } = this.refs

      const contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: [
          {type:phonetype1.value, number: phone1.value},
          {type:phonetype2.value, number: phone2.value}
        ],
        address: address.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
        birthdate: birthdate.state.inputValue,
        referral: referral.value,
        website: website.value,
        fax: fax.value,
        company: this.state.company || '',
        title: title.value,
        facebook: facebook.value,
        linkedin:linkedin.value,
        twitter: twitter.value,
        google: google.value,
        ning: ning.value
      }

      if (id) {
        firebase.set(`contacts/${id}`, contact, () => {
          History.log(firebase, History.EVENT.UPDATE, 'contact', id, id, contact.firstName + ' ' + contact.lastName)
        })
      } else {
        const newContact = firebase.push(`contacts`, contact, () => {
          History.log(firebase, History.EVENT.ADD, 'contact', newContact.name(), newContact.name(), contact.firstName + ' ' + contact.lastName)
        })
      }
      dispatch(pushState(null, '/contacts'))

    }

    const contact = (id && contacts && contacts[id]) ? contacts[id] : {
      firstName: '',
      lastName: '',
      email: '',
      phone: [
        {type:'', number:''},
        {type:'', number:''}
      ],
      address: '',
      city: '',
      state: '',
      zip: '',
      birthdate: '',
      referral: '',
      website: '',
      fax: '',
      company: '',
      title: '',
      facebook: '',
      linkedin:'',
      twitter: '',
      google: '',
      ning: ''
    }

    if(typeof contact.phone == 'string'){
      contact.phone = [
        {type:'work', number:contact.phone},
        {type:'', number:''}
      ]
    }

    if(id && this.state.company===undefined){
      this.state.company = contact.company
    }

    const companySelected = company => {
      this.state.company = company
      this.setState(this.state)
    }

    const allCompanies = _.map(companies, (company, id) => ({value: id, label:company.companyName}))

    return (
      <div id="add-update-contact">
        <section id="page-title" className={id ? "hide" : "padding-top-15 padding-bottom-15"}>
          <div className="row">
            <div className="col-sm-7">
              <h1 className="mainTitle">Contacts</h1>
              <span className="mainDescription">{id ? "Edit A Contact" : "Add A New Contact"}</span>
            </div>
            <div className="col-sm-5">
            </div>
          </div>
        </section>
        <div className={id ? "" : "container-fluid container-fullw bg-white"}>
          <div className="row">
            <div className="col-md-12">
              <form method="post" onSubmit={handleSubmit} id="contact-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">First Name<span className="symbol required"></span></label>
                      <input type="text" className="form-control" name="firstname" ref="firstName"
                             defaultValue={contact.firstName}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Last Name<span className="symbol required"></span></label>
                      <input type="text" className="form-control" name="lastname" ref="lastName"
                             defaultValue={contact.lastName}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Email</label>
                      <input type="text" className="form-control" name="email" ref="email" defaultValue={contact.email}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Phone 1 </label>
                      <select className="form-control" ref="phonetype1" defaultValue={contact.phone[0].type}>
                        <option value="">-- Select --</option>
                        <option value="work">Work</option>
                        <option value="home">Home</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Number</label>
                      <input type="text" className="form-control" name="phone" ref="phone1" defaultValue={contact.phone[0].number}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Phone 2 </label>
                      <select className="form-control" ref="phonetype2" defaultValue={contact.phone[1].type}>
                        <option value="">-- Select --</option>
                        <option value="work">Work</option>
                        <option value="home">Home</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Number</label>
                      <input type="text" className="form-control" name="phone" ref="phone2" defaultValue={contact.phone[1].number}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Address</label>
                      <textarea name="address" className="form-control" ref="address"
                                defaultValue={contact.address}></textarea>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>City / State / Zip</label>
                      <div className="row">
                        <div className="col-sm-4">
                          <input type="text" name="city" className="form-control" ref="city"
                                 defaultValue={contact.city}/>
                        </div>
                        <div className="col-sm-4">
                          <input type="text" name="state" className="form-control" ref="state"
                                 defaultValue={contact.state}/>
                        </div>
                        <div className="col-sm-4">
                          <input type="text" name="zip" className="form-control" width="20" ref="zip"
                                 defaultValue={contact.zip}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Fax</label>
                      <input type="text" className="form-control" name="referralsource" ref="fax"
                             defaultValue={contact.fax}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Website</label>
                      <input type="text" className="form-control" name="referralsource" ref="website"
                             defaultValue={contact.website}/>
                    </div>
                  </div>
                  </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Date of Birth</label>
                      <DateTimeField mode="date" inputFormat="MM-DD-YYYY" defaultText={contact.birthdate}
                                     inputProps={{id: "dob", name: "dob" }} ref="birthdate"/>
                      {/*<input className="form-control form-control-inline input-medium date-picker" name="dob" size="16" type="text" ref="birthdate" defaultValue={contact.birthdate}/>*/}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Referal Source</label>
                      <input type="text" className="form-control" name="referralsource" ref="referral"
                             defaultValue={contact.referral}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Company</label>
                      <Select onChange={companySelected} simpleValue options={allCompanies} multi={false} value={this.state.company} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Title</label>
                      <input type="text" className="form-control" ref="title" defaultValue={contact.title}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Facebook</label>
                      <input type="text" className="form-control"  ref="facebook" defaultValue={contact.facebook}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Linkedin</label>
                      <input type="text" className="form-control" ref="linkedin" defaultValue={contact.linkedin}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Google+</label>
                      <input type="text" className="form-control"  ref="google" defaultValue={contact.google}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Twitter</label>
                      <input type="text" className="form-control" ref="twitter" defaultValue={contact.twitter}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Ning profile</label>
                      <input type="text" className="form-control" ref="ning" defaultValue={contact.ning}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">

                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="form-action fluid col-md-6 margin-top-15">
                    <button type="submit" className="btn btn-wide btn-success margin-right-15">Submit</button>
                    <Link to="/contacts">
                      <button type="reset" className="btn btn-o btn-wide btn-default">Cancel</button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


    )
  }

  /* componentDidMount() {
   $("#contact-form").validate({
   errorElement: "span", // contain the error msg in a span tag
   errorClass: 'help-block',
   errorPlacement: function (error, element) { // render error placement for each input type
   if (element.attr("type") == "radio" || element.attr("type") == "checkbox") { // for chosen elements, need to insert the error after the chosen container
   error.insertAfter($(element).closest('.form-group').children('div').children().last());
   } else if (element.attr("name") == "dd" || element.attr("name") == "mm" || element.attr("name") == "yyyy") {
   error.insertAfter($(element).closest('.form-group').children('div'));
   } else {
   error.insertAfter(element);
   // for other inputs, just perform default behavior
   }
   },
   ignore: "",
   rules: {
   firstname: {
   minlength: 2,
   symbol required: true
   },
   lastname: {
   minlength: 2,
   symbol required: true
   },
   email: {
   email: true
   },

   zipcode: {
   number: true,
   minlength: 5
   },

   birthdate: {

   }
   },
   messages: {
   firstname: "Please specify your first name",
   lastname: "Please specify your last name",
   email: {
   email: "Your email address must be in the format of name@domain.com"
   },
   },
   groups: {
   DateofBirth: "dd mm yyyy",
   },
   invalidHandler: function (event, validator) { //display error alert on form submit

   },
   highlight: function (element) {
   $(element).closest('.help-block').removeClass('valid');
   // display OK icon
   $(element).closest('.form-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('symbol required');
   // add the Bootstrap error class to the control group
   },
   unhighlight: function (element) { // revert the change done by hightlight
   $(element).closest('.form-group').removeClass('has-error');
   // set error class to the control group
   },
   success: function (label, element) {
   label.addClass('help-block valid');
   // mark the current input as valid and display OK icon
   $(element).closest('.form-group').removeClass('has-error').addClass('has-success').find('.symbol').removeClass('symbol required').addClass('ok');
   },
   submitHandler: function (form) {
   return false;
   }
   });
   } */
}
