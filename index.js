/**
 * @format
 */
import React from 'react';
import {AppRegistry, Text, AsyncStorage} from 'react-native';
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
  return 0;
  // return action.value;
}

function tryForLaporan(state, action) {
  if (typeof state === 'undefined') {
    return [];
  }
  else{
    if (action.type == 'initValue') {
      return action.data;
    }
    else if (action.type == 'changeStatus') { 
      let newDataUpdate = {
        acc : action.data.typeAcc,
        name : state[action.data.indexUser].file[action.data.indexLaporan].name,
        row : state[action.data.indexUser].file[action.data.indexLaporan].row
      }
      state[action.data.indexUser].file.splice(action.data.indexLaporan, 1, newDataUpdate);
      return state;
    }
    else{
      return 0
    }
  }
}

async function mainUseless() {
  var attr = await AsyncStorage.getItem('attrLogin');
  if (attr !== null) {
    var real = JSON.parse(attr);
    return {
      name : real.name,
      img : real.img,
    }
  }
  else{
    return null;
  }
}

function imageLogin(state, action) {
  if (typeof state === 'undefined') {
    var json = mainUseless();
    return json;
  }
  else{
    if (action.type == 'fromLogin') {
      return {
        _55 : {
          img : action.data.img,
          name : action.data.name,
        }
      }
    }
    else if(action.type == 'fromGallery') {
      return {
        _55 : {
          img : action.data,
          name : state['_55'].name
        }
      };
    }
    else {
      var json = mainUseless();
      return json;
    }
  }
}

let store = createStore(combineReducers({ count: counter, dataLaporan : tryForLaporan, imageLogin :  imageLogin}));
let CountContainer = connect(state => ({ count: state.count, dataLaporan : state.dataLaporan, imageLogin : state.imageLogin }))(App);

const AsistenHeadless = async (data) => {
  store.dispatch({type : 'kirim', value : data});
};


class Main extends React.Component {
  render(){
    
    return (
      <Provider store={store}>
        <CountContainer screenProps={{fromNotif : this.props.fromNotifi}} />
      </Provider>
    )
  }
}

AsistensService.startService();
AppRegistry.registerHeadlessTask('AsistensService', () => AsistenHeadless);
AppRegistry.registerComponent(appName, () => Main);
