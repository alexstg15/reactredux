import boostrap from './assets/vendor/bootstrap/css/bootstrap.min.css'
import fontAwesome from './assets/vendor/fontawesome/css/font-awesome.min.css'
import themifyIcons from './assets/vendor/themify-icons/themify-icons.min.css'
import animate from './assets/vendor/animate.css/animate.min.css'
import perfectScrollbar from './assets/vendor/perfect-scrollbar/perfect-scrollbar.min.css'
import switchery from './assets/vendor/switchery/switchery.min.css'
import templateStyle from './assets/css/styles.css'
import plugins from './assets/css/plugins.css'
import theme1 from './assets/css/themes/theme-1.css'
import select2 from './assets/vendor/select2/select2.min.css'
import dataTables from './assets/vendor/DataTables/css/DT_bootstrap.css'
import datetimepickerCSS from '../node_modules/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'

// import jQuery from './assets/vendor/jquery/jquery.min.js'
// import bootstrapjs from './assets/vendor/bootstrap/js/bootstrap.min.js'
// import modernizr from './assets/vendor/modernizr/modernizr.js'
import jsqueryCookie from './assets/vendor/jquery-cookie/jquery.cookie.js'
import perfetScrollbarJS from './assets/vendor/perfect-scrollbar/perfect-scrollbar.min.js'
import switcheryJS from './assets/vendor/switchery/switchery.min.js'
import select2JS from './assets/vendor/select2/select2.min.js'
import dataTablesJS from './assets/vendor/DataTables/jquery.dataTables.min.js'

import selectCSS from '../node_modules/react-select/dist/react-select.css'

import styles from './css/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
// import createBrowserHistory from 'history/lib/createBrowserHistory'


import App from './pages/App'

import configureStore from './stores'

const store = configureStore()

const targetEl = document.getElementById('root')

const node = <App  store={store}/>
ReactDOM.render(node, targetEl)

