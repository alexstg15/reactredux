import React from 'react'
import {connect} from 'react-redux'

import {firebase, helpers} from 'redux-react-firebase'

const {dataToJS, pathToJS} = helpers
export default
@connect(
  ({firebase}) => ({
    auth: pathToJS(firebase, 'auth'),
    authError: pathToJS(firebase, 'authError')
  })
)
@firebase([])
class Signup extends React.Component {


    render() {
        const {user, dispatch, firebase, authError} = this.props

        const signup = (event) => {
            event.preventDefault()
            const email = this.refs.email.value
            const password = this.refs.password.value
            const firstName = this.refs.firstName.value
            const lastName = this.refs.lastName.value
            firebase.createUser({email, password})
        }

        const authenticationError = (authError) ?  authError.toString():''
        return (
            <div className="login">
                <div className="heading">
                    <h2>Sign in</h2>
                    <form action="#">

                        <div className="input-group input-group-lg">
                            <span className="input-group-addon"><i className="fa fa-user"></i></span>
                            <input type="text" className="form-control" placeholder="Username or email" ref="email"/>
                        </div>
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                            <input type="password" className="form-control" placeholder="Password" ref="password" />
                        </div>
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                            <input type="text" className="form-control" placeholder="First Name" ref="firstName" />
                        </div>
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                            <input type="text" className="form-control" placeholder="Last Name" ref="lastName" />
                        </div>
                        {authenticationError}
                        <button type="submit" className="float" onClick={signup}>Signup</button>
                    </form>
                </div>
            </div>
        )
    }

}

