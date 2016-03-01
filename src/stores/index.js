import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'


import routes from '../routes/index.js'


const rootReducer = combineReducers({
  router: routerStateReducer,
  firebase: firebaseStateReducer
})

const createStoreWithMiddleware = compose(
    reduxReactFirebase('https://brilliant-inferno-1262.firebaseio.com/'),
    applyMiddleware(thunkMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    })
)(createStore);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}

