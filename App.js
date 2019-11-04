import React from 'react';
import { AsyncStorage , ActivityIndicator, View, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { Provider, connect } from 'react-redux';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

import Absen from './src/screens/Absen';
import Nilai from './src/screens/Nilai';
import Praktikum from './src/screens/Praktikum';
import Login from './src/screens/Login';
import DaftarNilai from './src/screens/DaftarNilai';
import Timer from './src/screens/Timer';
import Laporan from './src/screens/Laporan';
import Mid from './src/screens/Mid';
import Final from './src/screens/Nilai_final';
let Counter = connect(state => ({count : state.count}))(Timer);
const AppStack = createStackNavigator({
    Home: {
        screen: Absen,
    },
    Nilai : {
        screen : Nilai,
    },
    Laporan : {
        screen : Laporan,
    },
    Mid : {
        screen : Mid,
    },
    Final : {
        screen : Final,
    },
    Praktikum : {
        screen : Praktikum,
    },
    Timer : {
        screen : ({navigation, screenProps}) => {
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

const AppsContainer =  createAppContainer(
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

export default class App extends React.Component {
    constructor (props){
        super(props);
        this.theme = useColorScheme();
    }
    render (){
        return (
            <AppsContainer theme={this.theme} screenProps={this.props.screenProps} />
        )
    }
}

