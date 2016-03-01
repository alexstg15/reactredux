
import React, {Component} from 'react'
import {connect} from 'react-redux'


class ContactDeleteNoteModal extends Component {

  render() {

    const {dispatch} = this.props


    return (
      <div className="modal fade" id="delete-note" tabIndex="-1" aria-hidden="true">
        <div className="modal-header">
          <a href="#" data-dismiss="modal" aria-hidden="true" className="close">×</a>

          <h3>Delete Note</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete selected note?</p>
        </div>
        <div className="modal-footer">

          <input type="hidden" name="note_id" id="note_id" value=""/>
          <input type="hidden" name="contact_id" value="dynamic contact id"/>
          <input type="hidden" name="type" value="note-delete"/>
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

export default connect(mapStateToProps)(ContactDeleteNoteModal)
