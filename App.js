import React from 'react';
import { AsyncStorage , View, ActivityIndicator, Text, NativeEventEmitter, NativeModules} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';

import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Icon, Avatar } from 'react-native-elements';
import { Provider, connect } from 'react-redux';

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
import MainHome from './src/screens/MainHome';

//move to INdex Mhs
// import Mhs from './src/screens/Mhs/Profil';
// import QrCode from './src/screens/Mhs/Qrcode';
import IndexMhs from './src/screens/Mhs/Index';


import Logout from './src/screens/Logout';
import AsistensService from './AsistensService';


let Counter = connect(state => ({count : state.count}))(Timer);
let ItemReport = connect(state => (state.reduxAsisten))(ItemLaporan);
let ApproverPage = connect(state => (state.reduxAsisten))(Approver);
let LoginPage = connect(state => ({imageLogin : state.reduxAsisten}))(Login);
let SettingPage = connect(state => (state.reduxAsisten))(Setting);
let GambarPage = connect(state => ({imageLogin : state.reduxAsisten}))(Gambar);
let IndexMhsPage = IndexMhs;



const BootMenu = createStackNavigator({
    Setting : {screen : SettingPage},
    Useless : {
        screen : Praktikum,
    },
    Gambar : {
        screen : GambarPage,
    },
}, {initialRouteName : 'Setting'})

// const FadeTrans = (position, index) => {
//     const screenRange = [index-1, index]
//     const  output = [0, 1]
//     const transition = position.interpolate({
//         inputRange : screenRange,
//         outputRange: output,
//     });
//     return {
//         opacity: transition
//     }
// }

// const bottomAnim = (position, index, width) => {
//     const screenRange = [index-1, index]
//     const  output = [width, 0]
//     const transition = position.interpolate({
//         inputRange : screenRange,
//         outputRange: output,
//     });
//     return {
//         transform: [{translateX: transition}]
//     }
// }

// const NavOption = () => {
//     return {
//         screenInterpolator : (props) => {
//             const { layout, position, scene } = props;
//             const { index } = scene;
//             // return FadeTrans(position, index)
//             const width = layout.initWidth;
//             return bottomAnim(position, index, width);
//         }
//     }
// }

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
    GambarPage: {
        screen: GambarPage,
    }
    
}, {
    initialRouteName : 'Prak', 
    // transitionConfig: NavOption
});

const Tab = createBottomTabNavigator(
    {
        Home : {
            screen : AppStack,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    if (focused) {
                        return (
                            <View style={{borderColor: '#fff', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 27, borderWidth: 4, backgroundColor: focused ? '#fff' : tintColor, borderRadius: 100}}>
                                <View style={{width: 55, height: 55, borderWidth: 4, borderColor: '#004dcf', backgroundColor: focused ? '#fff' : tintColor, padding: 10, justifyContent: 'center', borderRadius: 100}}>
                                    <Icon type="font-awesome" color={ focused ? tintColor : '#747474'} name="home" />
                                </View>
                            </View>
                        )
                    } else {
                        return (<Icon type="font-awesome" color="#fff" name="home" />)
                    }
                }
            })
        },
        Setting : {
            screen  : BootMenu,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    if (focused) {
                        return (
                            <View style={{borderColor: '#fff', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 27, borderWidth: 4, backgroundColor: focused ? '#fff' : tintColor, borderRadius: 100}}>
                                <View style={{width: 55, height: 55, borderWidth: 4, borderColor: '#004dcf', backgroundColor: focused ? '#fff' : tintColor, padding: 10, justifyContent: 'center', borderRadius: 100}}>
                                    <Icon type="font-awesome" color={ focused ? tintColor : '#747474'} name="gear" />
                                </View>
                            </View>
                        )
                    } else {
                        return (<Icon type="font-awesome" color="#fff" name="gear" />)
                    }
                }
            })
        }
    }, 
    {
        tabBarOptions : {
            style: {
                backgroundColor: '#004dcf',
            },
            labelStyle : {
                fontSize : 13,
                fontWeight : "bold",
                color: '#fff'
            },
            activeTabStyle: {
                backgroundColor: 'white',
                // borderBottomWidth: 4,
                // borderColor: '#6C1D7C'
              }
        },
        
    }
)


const AuthStack = createStackNavigator ({
    Login : {
        screen : LoginPage,
        navigationOptions: {
            header : null,
        },
    }
})

class CheckAuth extends React.Component{
    constructor(props){
        super(props);
        this._storageSession();
    }

    componentDidMount () {
        const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
        eventEmitter.addListener('notification-press', (event) => {
            this.props.navigation.navigate('Timer', {praktikum: event.praktikum})
        });
    }

    _storageSession = async () => {
        await AsyncStorage.multiGet(['isLogin', 'attrLogin']).then((value) => {
            if (this.props.screenProps.fromNotif) {
                this.props.navigation.navigate('Timer', {praktikum: this.props.screenProps.praktikum})
            } else {
                let attrLogin = JSON.parse(value[1][1]); 
                if (attrLogin) {
                    if (value[0][1] == 'login' && attrLogin.login_as == '003') {
                        this.props.navigation.navigate('App');
                    } else {
                        this.props.navigation.navigate('Mhs');
                    }
                } else {
                    this.props.navigation.navigate('Auth');
                }
            }
        })
        
    }

    render(){
        return(<ActivityIndicator style={{display : 'none'}} />)
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
        Logout : Logout,
        App : {
            screen : Tab
        },
        Mhs : {
            screen : IndexMhsPage,
        },
    },
    {
        initialRouteName : 'checkAuth',
    }
);

const AppsContainer =  createAppContainer(Switch);
export default AppsContainer;

