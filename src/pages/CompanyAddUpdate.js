import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {pushState} from 'redux-router'
import _ from 'lodash'

import {firebase, helpers} from 'redux-react-firebase'

const {dataToJS} = helpers


export default
@firebase()
@connect(
	({firebase}) => ({
		companies: dataToJS(firebase, 'companies')
	})
)
class CompanyAddUpdate extends Component {
	render() {
		const {companies, dispatch, params, firebase} = this.props

		const id = ( (params && params.id) ? params.id : ( (this.props.id) ? this.props.id : null ) )

		const handleSubmit = event => {
			const {
				companyName, address,
				city, state, zip,
				email, phone, website,
				fax, companyType,
				} = this.refs

			const company = {
				companyName: companyName.value,
				address: address.value,
				city: city.value,
				state: state.value,
				zip: zip.value,
				email: email.value,
				phone: phone.value,
				fax: fax.value,
				website: website.value,
				companyType: companyType.value
			}

			if (id) {
				firebase.set(`companies/${id}`, company)
			} else {
				firebase.push(`companies`, company)
			}
			dispatch(pushState(null, '/companies'))

		}

		const company = (id) ? companies[id] : {
			companyName: '',
			address: '',
			city: '',
			state: '',
			zip: '',
			email: '',
			phone: '',
			fax: '',
			website: '',
			companyType: ''
		}

		return (
			<div id="add-update-company">
				<section id="page-title" className={id ? "hide" : "padding-top-15 padding-bottom-15"}>
					<div className="row">
						<div className="col-sm-7">
							<h1 className="mainTitle">Companies</h1>
							<span className="mainDescription">{id ? "Edit A Company" : "Add A New Company"}</span>
						</div>
						<div className="col-sm-5">
						</div>
					</div>
				</section>
				<div className={id ? "" : "container-fluid container-fullw bg-white"}>
					<div className="row">
						<div className="col-md-12">
							<form method="post" onSubmit={handleSubmit} id="contact-form"/>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Company Name<span className="required">*</span></label>
										<input type="text" className="form-control" name="companyName" ref="companyName"
										       defaultValue={company.companyName}/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Address<span className="required">*</span></label>
										<input type="text" className="form-control" name="address" ref="address"
										       defaultValue={company.address}/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Email<span className="required">*</span></label>
										<input type="text" className="form-control" name="email" ref="email"
										       defaultValue={company.email}/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label>City / State / Zip</label>
										<div className="row">
											<div className="col-sm-4">
												<input type="text" name="city" className="form-control" ref="city"
												       defaultValue={company.city}/>
											</div>
											<div className="col-sm-4">
												<input type="text" name="state" className="form-control" ref="state"
												       defaultValue={company.state}/>
											</div>
											<div className="col-sm-4">
												<input type="text" name="zip" className="form-control" width="20" ref="zip"
												       defaultValue={company.zip}/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Phone<span className="required">*</span></label>
										<input type="text" className="form-control" name="phone" ref="phone"
										       defaultValue={company.phone}/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Website<span className="required">*</span></label>
										<input type="text" className="form-control" name="people" ref="website"
										       defaultValue={company.website}/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Fax<span className="required">*</span></label>
										<input type="text" className="form-control" name="fax" ref="fax" defaultValue={company.fax}/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="control-label">Company Type<span className="required">*</span></label>
										<select className="form-control" name="companyType" ref="companyType"
										        defaultValue={company.companyType}>
											<option value="Live events">Live events</option>
											<option value="Networking">Networking</option>
											<option value="Other">Other</option>
										</select>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="form-action fluid col-md-6 margin-top-15">
									<button onClick={handleSubmit} type="submit" className="btn btn-wide btn-success margin-right-15">
										Submit
									</button>
									<Link to="/companies">
										<button type="reset" className="btn btn-o btn-wide btn-default">Cancel</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
}
