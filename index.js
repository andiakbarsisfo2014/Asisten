/**
 * @format
 */
import React from 'react';
import {AppRegistry, Text, AsyncStorage, AppState, NativeEventEmitter, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsistensService from './AsistensService';
// import {setDetik, store} from './store';

import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Akbar from './Akbar';

function counter(state, action) {
    console.log(action.value);

    if (typeof state === 'undefined') {
        return {
            Minutes : 0,
            Seconds : 0,
            praktikum: "Tidak ada praktikum"
        }
    }
    if (action.type == "kirim") {
        return action.value;
    } else {
        return {
            Minutes : 0,
            Seconds : 0,
            praktikum: "Tidak ada praktikum"
        } 
    }
    
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
            console.log('tryForLaporan');
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
        else{
            return {
                _55 : {
                    img : action.data,
                    name : state['_55'].name
                }
            };
        }

    }
}

function dataNilaiSiswa(state, action) {
    if (typeof state === 'undefined') {
        return null
    }
    else {
        return {
            data : action.data
        }
    }
}

function fromNotif(state, action) {
    if (typeof state === 'undefined') {
        return false;
    }
    else{
        return true;
    }
}

let store = createStore(combineReducers(
    { 
        count: counter,
        dataLaporan: tryForLaporan, 
        imageLogin: imageLogin, 
        dataNilaiSiswa: dataNilaiSiswa, 
        fromNotif: fromNotif
    }
));
let CountContainer = App; //connect(state => ({ count: state.count, dataLaporan : state.dataLaporan, imageLogin : state.imageLogin, dataNilaiSiswa : state.dataNilaiSiswa, fromNotif : state.fromNotif }))(App);

const ConterEvent = async (data) => {
    store.dispatch({type : 'kirim', value : data});
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromNotif : this.props.fromNotifi,
            appState: AppState.currentState,
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', function(nextAppState) {
            if (AppState.currentState == 'background') {
                AsistensService.active(false);
            }
            else{
                AsistensService.active(true);
            }
        });
        
    }

    render(){
        return (
            <Provider store={store}>
                <CountContainer screenProps={{fromNotif : this.props.fromNotifi, praktikum : this.props.praktikum}}  />
            </Provider>
        )
    }
}

AsistensService.startService();
// AppRegistry.registerHeadlessTask('AsistensService', () => AsistenHeadless);
AppRegistry.registerHeadlessTask('ConterEvent', () => ConterEvent);
AppRegistry.registerComponent(appName, () => Main);
