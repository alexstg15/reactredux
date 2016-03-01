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
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { islogging: false };
  }


  render() {
      const { dispatch, firebase, auth, authError} = this.props

      const login = (event) => {
          event.preventDefault()

          const email = this.refs.email.value
          const password = this.refs.password.value

          this.setState( { islogging: !this.state.islogging } );

          firebase.login({email, password})
      }

      var btnclassname = "btn btn-primary pull-right ";
      if ( this.state.islogging && !authError) btnclassname = btnclassname + 'disabled';

      const authenticationError = (authError) ?  authError.toString():''
      return (
        <div className="row">
          <div className="main-login col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
            <div className="logo margin-top-30">
              {/*  <img src="assets/images/logo.png" alt="Earthstar"/> */}
            </div>
            <div className="box-login">
                <form className="form-login" action="#">
                    <fieldset>
                        <legend>
                            Sign in to your account
                        </legend>
                        <p>
                            Please enter your name and password to log in.
                        </p>
                        <div className="form-group">
                          <span className="input-icon">
                          <input type="text" className="form-control" name="email" placeholder="Email" ref="email" />
                          <i className="fa fa-user"></i> </span>
                        </div>
                        <div className="form-group form-actions">
                            <span className="input-icon">
                                <input type="password" className="form-control password" name="password" placeholder="Password" ref="password" />
                                <i className="fa fa-lock"></i>
                                <a className="forgot" href="login_forgot.html">
                                    I forgot my password
                                </a>
                            </span>
                        </div>
                        <div className="form-actions">
                            <div className="checkbox clip-check check-primary">
                                <input type="checkbox" id="remember" value="1" />
                                <label>
                                    Keep me signed in
                                </label>
                            </div>
                            {authenticationError}
                            <button type="submit" className={btnclassname} onClick={login} ref="btnsubmit">
                              Login <i className="fa fa-arrow-circle-right"></i>
                            </button>
                        </div>
                    </fieldset>
                </form>
                  <div className="copyright">
                      &copy; <span className="current-year"></span><span className="text-bold text-uppercase"> Earthstar</span>. <span>All rights reserved</span>
                  </div>
                </div>
            </div>
        </div>
      )
  }

}

