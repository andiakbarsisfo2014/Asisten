import React from 'react';
import {Text, View, ActivityIndicator, AsyncStorage, StatusBar, BackHandler, Alert} from 'react-native';

import ConfigApi from './config/ConfigAPI';
import AsistensService from '../../AsistensService';
export default class Logout extends React.Component {
    async componentDidMount () {
        let attrLogin = await AsyncStorage.getItem('attrLogin');
        let attrLoginJSON = JSON.parse(attrLogin);
        let token = attrLoginJSON.token;
        let urlLogout = '';
        if (attrLoginJSON.login_as == '003') {
            urlLogout = ConfigApi.link + 'logout-asisten';
        } else {
            urlLogout = ConfigApi.link + 'logout-mhs';
        }
        let result = await fetch(urlLogout, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            }
        })
        await AsyncStorage.clear();
        AsistensService.deleteDataSocket();
        this.props.navigation.navigate('Auth');
        // if (result.status == 200) {
        //     await AsyncStorage.clear();
        //     this.props.navigation.navigate('Auth');
        // }
        // else{
        //     Alert.alert(
        //         'Message',
        //         'Something wrong',
        //         [
        //             {text : 'Ok', onPress : () => BackHandler.exitApp()}
        //         ],
        //         {cancelable : false}
        //     )
        // }
    }
    render(){
        return (
            <View style={{flex : 1, flexDirection : 'column', backgroundColor : '#004dcf', justifyContent : 'center', alignItems : 'center'}}>
                <StatusBar backgroundColor="#004dcf" />
                <View style={{marginBottom : 8}}>
                    <Text style={{fontSize : 20, color : '#fff'}}>Logout ...</Text>
                </View>
                <View>
                    <ActivityIndicator color="#fff" />
                </View>
            </View>
        )
    }
}

