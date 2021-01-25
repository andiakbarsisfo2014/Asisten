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



// function tryForLaporan(state, action) {
    
//     if (typeof state === 'undefined') {
//         return [];
//     }
//     else{
//         if (action.type == 'initValue') {
//             return action.data;
//         }
//         else if (action.type == 'changeStatus') { 
//             let newDataUpdate = {
//                 acc : action.data.typeAcc,
//                 name : state[action.data.indexUser].file[action.data.indexLaporan].name,
//                 row : state[action.data.indexUser].file[action.data.indexLaporan].row
//             }
//             state[action.data.indexUser].file.splice(action.data.indexLaporan, 1, newDataUpdate);
//             return {
//                 ...state
//             }
//         }
//         else{
//             console.log('tryForLaporan');
//             return {
//                 ...state,
//             }
//         }
//     }
// }

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


function reduxAsisten(state, action) {
    if (typeof state === 'undefined') {
        return {
            fromNotif: false,
            dataNilaiSiswa: null,
            imageLogin: mainUseless(),
            dataLaporan: [],
            count: {
                Minutes : 0,
                Seconds : 0,
                praktikum: "Tidak ada praktikum"
           }
        }
    }
    else if(action.type == 'dataNilaiSiswa') {
        return {
            ...state, 
            dataNilaiSiswa: action.data
        }
    }
    else if(action.type == "kirim") {
        return {
            ...state,
            count: action.value
        }
    }
    else if(action.type == 'initValue') {
        return {
            ...state,
            dataLaporan: action.data
        }
    }
    else if(action.type == 'changeStatus') {
        let newDataUpdate = {
            acc : action.data.typeAcc,
            name : state.dataLaporan[action.data.indexUser].file[action.data.indexLaporan].name,
            row : state.dataLaporan[action.data.indexUser].file[action.data.indexLaporan].row
        }
        state.dataLaporan[action.data.indexUser].file.splice(action.data.indexLaporan, 1, newDataUpdate);
        return {
            ...state,
        }
    }

    else if(action.type == 'fromGallery') {
        return {
            ...state,
            imageLogin: {
                _55: {
                    name : state.imageLogin._55.name,
                    img : action.data,
                }
            }
        }
    }

    else if(action.type == 'fromLogin') {
        return {
            ...state, 
            imageLogin: {
                _55 : {
                    img : action.data.img,
                    name : action.data.name,
                }
            }
        }
    }

    else if(action.type == 'setData') {
        return {
            ...state,
            data: action.data
        }
    }
}

let store = createStore(combineReducers({ reduxAsisten: reduxAsisten}));
let CountContainer = App; 
//connect(state => ({ count: state.count, dataLaporan : state.dataLaporan, imageLogin : state.imageLogin, dataNilaiSiswa : state.dataNilaiSiswa, fromNotif : state.fromNotif }))(App);

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
