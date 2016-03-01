
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firebase, helpers} from 'redux-react-firebase'
import ReactS3Uploader from 'react-s3-uploader'

import * as History from '../../models/History'

const {dataToJS, isLoaded} = helpers

export default
@firebase(['contacts'])
@connect(
  ({firebase}, {id}) => ({
    contact: dataToJS(firebase, `contacts/${id}`)
  })
)
class ContactAddFileModal extends Component {
  constructor(){
    super()
    this.state = {uploading: false}
  }


  render() {

    const {dispatch,firebase, id, contact, editNote} = this.props
    const {firstName, lastName} = contact || {firstName:'', lastName:''}

    const onUploadFinish = (file) => {
      const newfile = firebase.push(`contacts/${id}/files`, file.filename, () => {
        History.log(firebase, History.EVENT.ADD, 'file', newFile.name(), id, file.filename)
      })
      $('#addfile').modal('toggle')
      $('#tab a[href="#files"]').tab('show')
      this.state.uploading = false
      this.setState(this.state)
    }

    const onUploadProgress = p => {
      this.state.uploading = p
      this.setState(this.state)
    }

    const upload = (this.state.uploading !== false) ?
                    `Uploading ${this.state.uploading}%`
                  : (<ReactS3Uploader
                      signingUrl="http://scripts.earthstar18.com/s3/sign"
                      accept="*"
                      uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
                      onFinish={onUploadFinish}
                      onProgress={onUploadProgress}
                      contentDisposition="auto"
                     />)

    return (
      <div className="modal fade" id="addfile" tabIndex="-1"  aria-hidden="true">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal"
            aria-hidden="true"></button>
          <h4 className="modal-title">Add a file for {firstName} {lastName}</h4>

          {upload}
        </div>
        <div className="modal-footer">

          <button type="reset" data-dismiss="modal" className="btn btn-default">Close</button>
        </div>
      </div>

    )
  }
}
