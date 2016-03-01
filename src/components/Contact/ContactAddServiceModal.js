
import React, {Component} from 'react'
import {connect} from 'react-redux'


class ContactAddServiceModal extends Component {

  render() {

    const {dispatch} = this.props

    return (
      <div className="modal fade" id="services" tabIndex="-1" data-width="760">

        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
          <h4 className="modal-title">Add a Service for Firstname Lastname</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-6">
              <a data-toggle="modal" data-dismiss="modal" href="#inneranimal"><img
                  src="assets/img/hp_bot_v1.jpg" width="100%"/></a>
            </div>
            <div className="col-md-6"><a data-toggle="modal" data-dismiss="modal" href="#inneranimal"><img
                  src="assets/img/hp_bot_v2.jpg" width="100%"/></a>
            </div>
          </div>
          <div className="row" style={{marginTop:15}}>
            <div className="col-md-6">
              <a data-toggle="modal" data-dismiss="modal" href="#inneranimal"><img
                  src="assets/img/hp_bot_v3.jpg" width="100%"/></a>
            </div>
            <div className="col-md-6"><a data-toggle="modal" data-dismiss="modal"
                href="#inneranimal"><img
                  src="assets/img/hp_bot_v4.jpg" width="100%"/></a></div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
  }
}

export default connect(mapStateToProps)(ContactAddServiceModal)
