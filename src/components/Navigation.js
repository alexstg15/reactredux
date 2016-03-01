import React, {Component} from 'react'

export default class Navigation extends Component {
	render() {
		const handleSidebarChange = (event) => {
			event.preventDefault()
			if(this.props.onSidebarChange){
				this.props.onSidebarChange()
			}
		}

    return(
    <header className="navbar navbar-default navbar-static-top">
        <div className="navbar-header">
            <a href="#" className="sidebar-mobile-toggler pull-left hidden-md hidden-lg btn btn-navbar sidebar-toggle" onClick={handleSidebarChange}>
                <i className="ti-align-justify"></i>
            </a>
            <a className="navbar-brand" href="/">
                ES18 ADMIN
            </a>
            <a href="#" className="sidebar-toggler pull-right visible-md visible-lg" onClick={handleSidebarChange}>
                <i className="ti-align-justify"></i>
            </a>
        </div>
        <div className="navbar-collapse collapse">
            <ul className="nav navbar-right">

	            {/*
                <li className="dropdown current-user">
                    <a href className="dropdown-toggle" data-toggle="dropdown">
                        <img src="assets/images/media-user.png" alt="Controls"/>
                            <span className="username">User Controls
                                <i className="ti-angle-down"></i>
                            </span>
                    </a>
                    <ul className="dropdown-menu dropdown-dark">
	                    <li>
                            <a href="pages_user_profile.html">
                                My Profile
                            </a>
                        </li>
                        <li>
                            <a href="pages_calendar.html">
                                My Calendar
                            </a>
                        </li>
                        <li>
                            <a href="login_lockscreen.html">
                                Lock Screen
                            </a>
                        </li>
                        <li>
                            <a href="login_signin.html">
                                Log Out
                            </a>
                        </li>
                    </ul>
                </li>
                */}
            </ul>
            <div className="close-handle visible-xs-block menu-toggler" data-toggle="collapse" href=".navbar-collapse">
                <div className="arrow-left"></div>
                <div className="arrow-right"></div>
            </div>
        </div>
    </header>
    )
  }
}
