
import Firebase from 'firebase'

export const EVENT = ({
  ADD: 'ADD',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE'
})

export const log = (firebase, event, what, id, contact='', data='' ) => {
  const eventObj = {event, what, id, contact, time: Firebase.ServerValue.TIMESTAMP}
  if(data){
    eventObj.data = data
  }
  firebase.push('history', eventObj)
}
