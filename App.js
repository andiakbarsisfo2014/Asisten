import React from 'react';
import { AsyncStorage , ActivityIndicator, Text, View} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Icon, Avatar } from 'react-native-elements';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
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

import Mhs from './Mhs';
import PraktikumMhs from './src/screens/Mhs/Praktikum';
let Counter = connect(state => ({count : state.count}))(Timer);
let ItemReport = connect(state => ({dataLaporan : state.dataLaporan}))(ItemLaporan);
let ApproverPage = connect(state => ({dataLaporan : state.dataLaporan}))(Approver);
let LoginPage = connect(state => ({imageLogin : state.imageLogin}))(Login);
let SettingPage = connect(state => ({imageLogin : state.imageLogin}))(Setting);
let GambarPage = connect(state => ({imageLogin : state.imageLogin}))(Gambar);
let MhsPage = connect(state => ({imageLogin : state.imageLogin}))(Mhs)

const DrawerContent = (props) => (
    <View>
      <View
        style={{
          backgroundColor: '#f50057',
          height: 170,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
                rounded
                size="xlarge"
                source={{uri : 'https://www.pinpng.com/pngs/m/510-5100567_react-native-svg-transformer-allows-you-import-svg.png'}}
            />
      </View>
      <DrawerItems {...props} />
    </View>
  )

const MhsStack = createDrawerNavigator (
    {
        Praktikum : {screen : PraktikumMhs},
        Profil : {screen : MhsPage},
    },
    {
        contentComponent : DrawerContent
    }
)

// const MhsStack = createStackNavigator({
//     Mhs : {screen : drawerMhs}
// })

const BootMenu = createStackNavigator({
    Setting : {screen : SettingPage},
    Useless : {
        screen : Praktikum,
    },
    Gambar : {
        screen : GambarPage,
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
        screen : LoginPage,
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
        await AsyncStorage.multiGet(['isLogin', 'attrLogin']).then((value) => {
            if (this.props.screenProps.fromNotif) {
                this.props.navigation.navigate('Timer')
            } else {
                let attrLogin = JSON.parse(value[1][1]); 
                if (value[0][1] == 'login' && attrLogin.login_as == '003') {
                    this.props.navigation.navigate('App');
                } else {
                    this.props.navigation.navigate('Mhs');
                }
            }
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
        MainHome : MainHome,
        App : {
            screen : Tab
        },
        Mhs : {
            screen : MhsStack
        }
    },
    {
        initialRouteName: 'checkAuth',
    }
);

const AppsContainer =  createAppContainer(Switch);

export default AppsContainer;

