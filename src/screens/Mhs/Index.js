import React from 'react';
import { AsyncStorage , ActivityIndicator, View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'; 
import {createBottomTabNavigator} from 'react-navigation-tabs';
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
const Praktikum_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Praktikum);
const Dokumen_ = connect(state => ({dataNilaiSiswa : state.dataNilaiSiswa}))(Dokumen);

const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    },
    container : {marginTop : 15, flex : 1, flexDirection : 'column'},
    btn : {flex : 1, flexDirection : 'row', alignItems : 'center'},
    label : {fontWeight : 'bold', color : '#464646', fontSize : 15, marginLeft : 10}
})

const MhsMenu = createBottomTabNavigator(
    {
        Praktikum : {
            screen : Praktikum_,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({ focused, horizontal, tintColor }) => {
                    return (
                        <Icon type="font-awesome" color={ focused ? tintColor : '#747474'} name="book" />
                    )
                }
            })
        },
        Profil : { 
            screen : Profil,
            navigationOptions : ({navigation}) => ({
                tabBarIcon : ({focused, horizontal, tintColor}) => {
                    return (
                        <Icon type="font-awesome" color={ focused ? tintColor : '#747474'} name="id-card" />
                    )
                }
            })
        },
    },
    {
        tabBarOptions : {
            labelStyle : {
                fontSize : 13,
                fontWeight : "bold"
            }
        },
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
        Timer : { screen : Counter
            // screen : ({navigation, screenProps}) => {
            //     return <Counter />
            // },
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
