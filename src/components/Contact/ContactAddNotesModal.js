import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {firebase, helpers} from 'redux-react-firebase'
import {pushState} from 'redux-router'
import _ from 'lodash'

import * as History from '../../models/History'

const {dataToJS, isLoaded} = helpers

export default
@firebase(['contacts'])
@connect(
  ({firebase}, {id}) => ({
    contact: dataToJS(firebase, `contacts/${id}`)
  })
)

class ContactAddNotesModal extends Component {

render()
{

  const {dispatch,firebase, id, contact, editNote} = this.props
  const {firstName, lastName} = contact || {firstName:'', lastName:''}

  const handleSubmit = event => {
    event.preventDefault()

    const {
      text,
      } = this.refs

    const time = moment().format()

    const note = {
      text: text.value,
      time: time
    }

    if(editNote){
      return firebase.set(`contacts/${id}/notes/${editNote.id}`, note, () => {
          History.log(firebase, History.EVENT.UPDATE, 'note', editNote.id, id,'')
        })
    }
    const newNote = firebase.push(`contacts/${id}/notes`, note, () => {
      History.log(firebase, History.EVENT.ADD, 'note', newNote.name(), id, '')
    })
  }


  const noteText = (editNote) ? editNote.text : ''

  return (
    <div className="modal fade" id="responsive" tabIndex="-1" data-width="760">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal"
                aria-hidden="true"></button>
        <h4 className="modal-title">Add a Note for {firstName} {lastName}</h4>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-12">
            <textarea className="form-control" name="text" ref="text" rows="6" defaultValue={noteText}></textarea>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="reset" data-dismiss="modal" className="btn btn-default">Close</button>
        <button onClick={handleSubmit} data-dismiss="modal" type="submit" className="btn blue">Save changes</button>
      </div>
    </div>
  )
}
}
