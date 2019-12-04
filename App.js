import React from 'react';
import { AsyncStorage , ActivityIndicator, View, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
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
import Setting from './src/screens/Setting';
import Pendahuluan from './src/screens/Pendahuluan';
import Approver from './src/screens/Approved';
import PdfRead from './src/screens/PdfRead';
import ItemLaporan from './src/screens/ItemLaporan';
import Gambar from './src/screens/Gambar';
let Counter = connect(state => ({count : state.count}))(Timer);
let ItemReport = connect(state => ({dataLaporan : state.dataLaporan}))(ItemLaporan);
let ApproverPage = connect(state => ({dataLaporan : state.dataLaporan}))(Approver);

const BootMenu = createStackNavigator({
    Setting : {screen : Setting},
    Useless : {
        screen : Praktikum,
    },
}, {initialRouteName : 'Setting'})

const AppStack = createStackNavigator({
    Home: {
        screen: Absen,
    },
    Nilai : {
        screen : Nilai,
    },
    PdfRead : {
        screen : PdfRead
    },
    Laporan : {
        screen : Laporan,
    },
    Gambar : {
        screen : Gambar,
    },
    Mid : {
        screen : Mid,
    },
    Pendahuluan : {
        screen : Pendahuluan
    },
    Approver : {
        screen : ApproverPage
    },
    ItemLaporan : {
        screen : ItemReport
    },
    Final : {
        screen : Final,
    },
    Prak : {
        screen : Praktikum,
    },
    Setting : {
        screen : Setting,
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
}, {initialRouteName : 'Prak'});

const Tab = createBottomTabNavigator(
    {
        Home : {screen : AppStack},
        Setting : {
            screen  : BootMenu,
        }
    }, 
    {
        defaultNavigationOptions : ({navigation}) => ({
            tabBarIcon : ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = focused ?  'home' : 'home';
                } else if (routeName === 'Setting') {
                    iconName = focused ? 'cogs' : 'cogs';
                }
                return <Icon name={iconName} type='font-awesome' size={25} color={tintColor} />;
            }
        }),
    }
)

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

const Switch =  createSwitchNavigator(
    {
        checkAuth : {
            screen : ({ navigation, screenProps }) => {
                return <CheckAuth navigation={navigation} screenProps={screenProps} />
            }
        },
        Auth : AuthStack,
        App : {
            screen : Tab
        }
    },
    {
        initialRouteName: 'checkAuth',
    }
);

const AppsContainer =  createAppContainer(Switch);

export default AppsContainer;

