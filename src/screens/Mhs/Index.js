import React from 'react';
import { AsyncStorage , ActivityIndicator, View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'; 
import {createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation-tabs';
import { Icon, Avatar } from 'react-native-elements';
import { Provider, connect } from 'react-redux';
import Praktikum from './Praktikum';
import Profil from './Profil';
import QrCode from './Qrcode';
import DaftarNilai from './DaftarNilai';
import Absen from './Absen';
import Respon from './Respon';
import Tp from './Tp';
import Tugas from './Tugas';
import Quis from './Quis';
import Laporan from './Laporan';
import Pdf from '../PdfRead';
import Dokumen from './Dokomen';
import Gambar from '../Gambar';
import Timer from '../Timer';

let Counter = connect(state => ({count : state.count}))(Timer);

let GambarPage = connect(state => ({imageLogin : state.imageLogin}))(Gambar);
const Absen_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Absen);
const Respon_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Respon);
const Tp_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Tp);
const Tugas_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Tugas);
const Quis_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Quis);
const Laporan_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Laporan);
const Praktikum_ = connect(state => ({dataNilaiSiswa : state.nilaiSiswa}))(Praktikum);
const Dokumen_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Dokumen);
const Profil_ = connect(state => ({imageLogin: state.imageLogin}))(Profil);

const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    },
    container : {marginTop : 15, flex : 1, flexDirection : 'column'},
    btn : {flex : 1, flexDirection : 'row', alignItems : 'center'},
    label : {fontWeight : 'bold', color : '#464646', fontSize : 15, marginLeft : 10}
});

const renderNav = (routeName, name, tintColor, focused) => (
    <View style={{flex: 1, alignItems: 'center', borderBottomColor: focused ? tintColor: '', borderBottomWidth: focused ? 4 : 0}}>
      <Icon name={name} color={tintColor} size={12} style={{paddingBottom: 4, paddingTop: 10}} />
      <Text  style={{paddingBottom: 8}}>{routeName}</Text>
    </View>
  )
  
  const customTabs = ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      if (routeName === 'Timer') {
        return renderNav(routeName, 'user', tintColor, focused);
      } else if (routeName === 'Home') {
        return renderNav(routeName, 'home', tintColor, focused);
      } else if (routeName === 'History') {
        return renderNav(routeName, 'history', tintColor, focused);
      } else if (routeName === 'Cart') {
        return renderNav(routeName, 'shopping-cart', tintColor, focused);
      }
    }
  });

  class FooterTabs extends React.Component {

    activTab = (route, navigation, icon, type) => {
        return (
            <TouchableHighlight underlayColor="transparent" style={{ height: 50, width: 100, alignItems: 'center'}} onPress={()=>navigation.navigate(route.routeName, {from: route.routeName})}>
                <View style={{ 
                                borderBottomLeftRadius: 36,
                                borderBottomRightRadius: 36,
                                borderTopStartRadius: -36,
                                height: 40, width: 90, borderWidth: 1, borderColor: 'red'}}>
                                    {/* <Icon type="font-awesome" color="blue" name="book" /> */}
                            </View>
            </TouchableHighlight>
        )
    }
    disactiveTab = (route, navigation, icon, type) => {
        return (
            <TouchableHighlight underlayColor="transparent" style={{marginTop:6, height: 50, width: 80, justifyContent: 'center'}} onPress={()=>navigation.navigate(route.routeName, {from: route.routeName})}>
                <View style={{marginTop: 18, flexDirection: 'column', justifyContent:'space-between', alignItems: 'center'}}>
                    {/* <View style={{borderColor: '#fff', backgroundColor: '#004dcf', height: 20, width: 70, borderRadius:36, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon color="#fff" size={20} type={type} name={icon} />
                    </View>
                    <View style={{height: 40, alignItems: 'center'}}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>{route.routeName}</Text>
                    </View> */}
                </View>
            </TouchableHighlight>
        )
    }

    render () {
        const { navigationState, navigation, position } = this.props;
        return (
            <View style={{backgroundColor: '#004dcf', flexDirection: 'row', justifyContent: 'space-around'}}>
            {
                navigationState.routes.map((route, index) => {
                    if (index == navigation.state.index ) {
                        return this.activTab(route, navigation, 'ios-book', 'ionicon')
                    }
                    else if(index == 1) {
                        return this.disactiveTab(route, navigation, 'home', 'font-awesome')
                    } 
                    else {
                        return this.disactiveTab(route, navigation, 'home', 'font-awesome') 
                    }
                })
            }
            </View>
        )
    }
}

const MhsMenu = createBottomTabNavigator(
    {
        Praktikum : {
            screen : Praktikum_,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    if (focused) {
                        return (
                            <View style={{borderColor: '#fff', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 27, borderWidth: 4, backgroundColor: focused ? '#fff' : tintColor, borderRadius: 100}}>
                                <View style={{width: 55, height: 55, borderWidth: 4, borderColor: '#004dcf', backgroundColor: focused ? '#fff' : tintColor, padding: 10, justifyContent: 'center', borderRadius: 100}}>
                                    <Icon type="ionicon" color={ focused ? tintColor : '#747474'} name="ios-book" />
                                </View>
                            </View>
                        )
                    } else {
                        return (<Icon type="font-awesome" color="#fff" name="home" />)
                    }
                }
            })
            
        },
        Profil : { 
            screen : Profil_,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    if (focused) {
                        return (
                            <View style={{borderColor: '#fff', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 27, borderWidth: 4, backgroundColor: focused ? '#fff' : tintColor, borderRadius: 100}}>
                                <View style={{width: 55, height: 55, borderWidth: 4, borderColor: '#004dcf', backgroundColor: focused ? '#fff' : tintColor, padding: 10, justifyContent: 'center', borderRadius: 100}}>
                                    <Icon type="ionicon" color={ focused ? tintColor : '#747474'} name="ios-user" />
                                </View>
                            </View>
                        )
                    } else {
                        return (<Icon type="font-awesome" color="#fff" name="home" />)
                    }
                }
            })
            
        },
        Timer : {
            screen : Counter,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    if (focused) {
                        return (
                            <View style={{borderColor: '#fff', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 27, borderWidth: 4, backgroundColor: focused ? '#fff' : tintColor, borderRadius: 100}}>
                                <View style={{width: 55, height: 55, borderWidth: 4, borderColor: '#004dcf', backgroundColor: focused ? '#fff' : tintColor, padding: 10, justifyContent: 'center', borderRadius: 100}}>
                                    <Icon type="ionicon" color={ focused ? tintColor : '#747474'} name="ios-clock" />
                                </View>
                            </View>
                        )
                    } else {
                        return (<Icon type="ionicon" color="#fff" name="ios-clock" />)
                    }
                }
            })
        },
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
        
        initialRouteName : 'Profil',
    }
);




const MhsStack = createStackNavigator(
    {
        QrCode : { screen : QrCode },
        MhsStack : { 
            screen : MhsMenu, 
            navigationOptions : ({navigation}) =>({
                title: "Asisten's",
                headerStyle: {
                    backgroundColor: '#004dcf',
                    elevation: 0,
                },
                
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                   
                },
                headerRight : (
                    <View style={{ flex : 1, alignItems : 'center', flexDirection : 'row', justifyContent : 'space-between'}}>
                        <TouchableHighlight style={css.rightComponent} onPress={() => navigation.navigate('QrCode') }>
                            <Icon name="qrcode" type="font-awesome" color="#fff" />
                        </TouchableHighlight>
                        <TouchableHighlight style={css.rightComponent} onPress={() => navigation.navigate('Logout')}>
                            <Icon name="sign-out" type="font-awesome" color="#fff" />
                        </TouchableHighlight>
                    </View>
                ),
                gesturesEnabled : true,
                gestureDirection : 'horizontal'
            })
        },
        Tp : {screen : Tp_},
        Respon : { screen : Respon_ },
        Tugas : {screen : Tugas_},
        Quis : {screen : Quis_},
        Laporan : {screen: Laporan_},
        Absen : {screen : Absen_},
        Pdf : {screen : Pdf},
        GambarPage : {screen : GambarPage},
        Dokumen : {screen : Dokumen_},
        Nilai : { screen : DaftarNilai }
    },
    {
        initialRouteName : 'MhsStack',
        headerMode: 'screen'
    }
)



export default MhsStack;
