import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import mainJS from '../assets/js/main.js'

export default
@connect(
  ({router}) => ({
    path: router.location.pathname
  })
)
class Navigation extends Component {

  componentDidMount(){
    mainJS.init()
  }

  render() {
    const {path} = this.props

    const getActiveOpen = path => {
      switch(path) {
        case '/':
          return {open: 'dashboard', active:'home'}
        case '/upcoming-events':
          return {open: 'upcoming-events', active:'home'}

        case '/tasks':
          return {open: 'tasks', active:'view'}
        case '/tasks/add':
          return {open: 'tasks', active:'add'}

        case '/contacts':
          return {open: 'contacts', active:'view'}
        case '/contact/add':
          return {open: 'contacts', active:'add'}

        case '/companies':
          return {open: 'companies', active:'view'}
        case '/companies/add':
          return {open: 'companies', active:'add'}

        case '/opportunities':
          return {open: 'opportunity', active:'view'}
        case '/opportunities/add':
          return {open: 'opportunity', active:'add'}
      }

      return {open :'', active: ''}
    }

    const {open, active} = getActiveOpen(path)


    return (
      <div className="sidebar app-aside" id="sidebar">
        <div className="sidebar-container perfect-scrollbar">
          <nav>
            <div className="search-form">
              <a className="s-open" href="#">
                <i className="ti-search"></i>
              </a>
              <form className="navbar-form" role="search">
                <a className="s-remove" href="#" target=".navbar-form">
                  <i className="ti-close"></i>
                </a>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Search..."/>
                  <button className="btn search-button" type="submit">
                    <i className="ti-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="navbar-title">
              <span>Main Navigation</span>
            </div>
            <ul className="main-navigation-menu">
              <li  className={(open=='dashboard') ? 'active open' : ''}>
                <Link to="/">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-dashboard"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title"> Dashboard </span>
                    </div>
                  </div>
                </Link>
              </li>
              <li  className={(open=='upcoming-events') ? 'active open' : ''}>
                <Link to="/upcoming-events">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-calendar"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title"> Upcoming Events </span>
                    </div>
                  </div>
                </Link>
              </li>
              <li className={(open=='tasks') ? 'active open' : ''}>
                <a href="javascript:void(0)">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-check-square"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title"> To Do </span>
                      <i className="icon-arrow"></i>
                    </div>
                  </div>
                </a>
                <ul className="sub-menu">
                  <li className={(open=='tasks' && active=='view') ? 'active' :''}>
                    <Link to="/tasks">
                      <span className="title"> View Tasks </span>
                    </Link>
                  </li>
                  <li className={(open=='tasks' && active=='add') ? 'active' :''}>
                    <Link to="/tasks/add">
                      <span className="title"> Add New Task </span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={(open=='contacts') ? 'active open' : ''}>
                <a href="javascript:void(0)">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-users"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title">Contacts</span>
                      <i className="icon-arrow"></i>
                    </div>
                  </div>
                </a>
                <ul className="sub-menu">
                  <li className={(open=='contacts' && active=='view') ? 'active' :''}>
                    <Link to="/contacts">
                      <span className="title"> View Contacts </span>
                    </Link>
                  </li>
                  <li className={(open=='contacts' && active=='add') ? 'active' :''}>
                    <Link to="/contact/add">
                      <span className="title"> Add New Contact </span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={(open=='companies') ? 'active open' : ''}>
                <a href="javascript:void(0)">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-building"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title">Companies</span>
                      <i className="icon-arrow"></i>
                    </div>
                  </div>
                </a>
                <ul className="sub-menu">
                  <li className={(open=='companies' && active=='view') ? 'active' :''}>
                    <Link to="/companies">
                      <span className="title"> View Companies </span>
                    </Link>
                  </li>
                  <li className={(open=='companies' && active=='add') ? 'active' :''}>
                    <Link to="/companies/add">
                      <span className="title"> Add New Company </span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={(open=='opportunity') ? 'active open' : ''}>
                <a href="javascript:void(0)">
                  <div className="item-content">
                    <div className="item-media">
                      <i className="fa fa-dollar"></i>
                    </div>
                    <div className="item-inner">
                      <span className="title">Opportunities</span>
                      <i className="icon-arrow"></i>
                    </div>
                  </div>
                </a>
                <ul className="sub-menu">
                  <li className={(open=='opportunity' && active=='view') ? 'active' :''}>
                    <Link to="/opportunities">
                      <span className="title"> View Opportunities </span>
                    </Link>
                  </li>
                  <li className={(open=='opportunity' && active=='add') ? 'active' :''}>
                    <Link to="/opportunities/add">
                      <span className="title"> Add New Opportunity </span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
  }
}
