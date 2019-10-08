import React from 'react';
import { AsyncStorage , ActivityIndicator, View, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { Provider, connect } from 'react-redux';

import Absen from './src/screens/Absen';
import Nilai from './src/screens/Nilai';
// import Scanner from './src/screens/Scanner';
import Praktikum from './src/screens/Praktikum';
import Login from './src/screens/Login';
import DaftarNilai from './src/screens/DaftarNilai';
import Timer from './src/screens/Timer';
let Counter = connect(state => ({count : state.count}))(Timer);
const AppStack = createStackNavigator({
    Home: {
        screen: Absen,
        navigationOptions : {
            header : null,
        }
    },
    Nilai : {
        screen : Nilai,
        navigationOptions : {
            header : null,
        }
    },
    Praktikum : {
        screen : Praktikum,
        navigationOptions : {
            header : null,
        }
    },
    Timer : {
        screen : ({navigation, screenProps}) => {
            // console.log(navigation)
            return <Counter />
        },
        navigationOptions : {
            header : null
        }
    }
    // QrCode : {
    //     screen : Scanner,
    //     navigationOptions : {
    //         header : null,
    //     }
    // }
}, {initialRouteName : 'Praktikum'});

const AuthStack = createStackNavigator ({
    Login : {
        screen : Login,
        navigationOptions : {
            header : null,
        }
    }
})

class CheckAuth extends React.Component{
    constructor(props){
        super(props);
        this._storageSession();
    }

    _storageSession = async () => {
        await AsyncStorage.getItem('isLogin').then((value) => {
            this.props.screenProps.fromNotif ?  this.props.navigation.navigate('Timer') :
            this.props.navigation.navigate(value == 'login' ? 'App' : 'Auth');
        })
        
    }

    render(){
        return(<ActivityIndicator />)
    }
} 

export default createAppContainer(
    createSwitchNavigator({
        checkAuth : {
            screen : ({ navigation, screenProps }) => {
                return <CheckAuth navigation={navigation} screenProps={screenProps} />
            }
        },
        Auth : AuthStack,
        App : {
            screen : AppStack
        }
    },
    {
        initialRouteName: 'checkAuth',
    }
));

