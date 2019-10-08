/**
 * @format
 */
import React from 'react';
import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsistensService from './AsistensService';
// import {setDetik, store} from './store';

import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Akbar from './Akbar';

function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }
  return action.value;
}
let store = createStore(combineReducers({ count: counter }));
let CountContainer = connect(state => ({ count: state.count }))(App);

const AsistenHeadless = async (data) => {
  console.log(data);
  store.dispatch({type : 'kirim', value : data});
};


class Main extends React.Component {
  render(){
    
    return (
      <Provider store={store}>
        <CountContainer screenProps={{fromNotif : this.props.fromNotifi}} />
        {/* <App screenProps={{fromNotif : this.props.fromNotifi}} />         */}
      </Provider>
    )
  }
}

AsistensService.startService();
AppRegistry.registerHeadlessTask('AsistensService', () => AsistenHeadless);
AppRegistry.registerComponent(appName, () => Main);
