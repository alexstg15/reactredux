
import React, {Component} from 'react'
import {connect} from 'react-redux'


class ContactModal extends Component {

  render() {

    const {dispatch} = this.props

    return (
      <div className="modal fade" id="delete-event" tabIndex="-1" aria-hidden="true">
        <div className="modal-header">
          <a href="#" data-dismiss="modal" aria-hidden="true" className="close">×</a>

          <h3>Delete Event</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete selected event?</p>
        </div>
        <div className="modal-footer">

          <input type="hidden" name="event_id" id="event_id" value=""/>
          <input type="hidden" name="contact_id" value="dynamic contact id"/>
          <input type="hidden" name="type" value="event-delete"/>
          <button type="button" className="btn default" data-dismiss="modal">Cancel
          </button>
          <button type="submit" className="btn red">Delete</button>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
  }
}

export default connect(mapStateToProps)(ContactModal)
