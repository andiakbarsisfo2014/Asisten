import React, { Component } from "react";

import {Keyboard, Text, StatusBar, TouchableOpacity, View, AsyncStorage, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';

import ConfigAPI from './config/ConfigAPI';


export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            username : '',
            password : '', 
            isLoading : false,
            label : 'Login Asisten',
            btnLabel : 'Mahasiswa',
            isAsisten : true,
            placeholder : 'Username',
        }
    }
    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', justifyContent : 'center'}} behavior="padding">
              <StatusBar backgroundColor="#fff" />
              <View style={{height : 100, width : '100%', justifyContent : 'center', marginBottom : 5}}>
                <Text style={styles.logoText}>Asisten's App</Text>
              </View>
              <View style={{ height : 190,}}>
                <TextInput style={{fontWeight : 'bold', borderColor : '#c4c3cb', marginTop : 10, marginHorizontal : 10, borderWidth : 1, borderRadius : 10, paddingHorizontal : 10}} placeholder={this.state.placeholder} value={this.state.username} onChange={(e) => this.setState({username : e.nativeEvent.text})} placeholderColor="#c4c3cb" />
                <TextInput style={{fontWeight : 'bold', borderColor : '#c4c3cb', marginTop : 10, marginHorizontal : 10, borderWidth : 1, borderRadius : 10, paddingHorizontal : 10}} placeholder="Password" value={this.state.password} onChange={(e) => this.setState({password : e.nativeEvent.text})} placeholderColor="#c4c3cb" secureTextEntry={true}/>
                <Button
                  buttonStyle={styles.loginButton}
                  onPress={() => this.onLoginPress()}
                  title={this.state.label}
                  loading={this.state.isLoading ? true: false}
                  disabled = {this.state.isLoading ? true : false}
                />
              </View>
              <TouchableOpacity onPress={() => this.state.isAsisten ? this.setState({label : 'Login Mahasiswa', btnLabel : 'Asisten', isAsisten : false, placeholder : 'NIM'}) : this.setState({label : 'Login Asisten', btnLabel : 'Mahasiswa', isAsisten : true, placeholder : 'Username'})} style={{marginHorizontal : 10, alignItems : 'flex-end', marginTop : 5}}>
                <Text style={{color : 'blue'}}>{this.state.btnLabel}</Text>
              </TouchableOpacity>
            </View>
        );
    }

    async onLoginPress() {
        var that = this;
        this.setState({isLoading : true});
        let urlPost = this.state.isAsisten ? ConfigAPI.link+'login-asisten' : ConfigAPI.link+'login-mahasiswa'; 
        const respons = await fetch(urlPost, {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(
                {
                    email : this.state.username,
                    password : that.state.password
                }
            )
        }).catch((error) => {
          that.setState({isLoading : false, password : ''});
          alert('Gagal Login ');
        });
        if (respons.status == 200) {
            that.setState({isLoading : false, username : '', password : ''});
            var msg =  await respons.json();
            AsyncStorage.setItem('isLogin', 'login');
            AsyncStorage.setItem('attrLogin',JSON.stringify({
                login_as : msg.success.login_as,
                name : msg.success.name,
                token : 'Bearer '+msg.success.token,
                img : msg.success.img,
            }));
            this.props.dispatch({type : 'fromLogin', data : {img : msg.success.img, name : msg.success.name}});
            this.state.isAsisten ? this.props.navigation.navigate('App') : this.props.navigation.navigate('Mhs');
        }
        else if (respons.status == 401) {
          that.setState({isLoading : false, password : ''});
          var msg = await respons.json();
          alert('Gagal Login : '+msg.error);
        }
        else{
          that.setState({isLoading : false, password : ''});
          alert('Gagal Login : '+respons.status);
        }
    }
}

const styles = StyleSheet.create({

containerView: {
  flex: 1,
},
loginScreenContainer: {
  flex: 1,
},
logoText: {
  fontSize: 40,
  fontWeight: "800",
  textAlign: 'center',
},
loginFormView: {
  flex: 1
},
loginFormTextInput: {
  height: 43,
  fontSize: 14,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#eaeaea',
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,

},
loginButton: {
  backgroundColor: '#3897f1',
  borderRadius: 5,
  height: 45,
  marginTop: 10,
  marginHorizontal : 10,
},
fbLoginButton: {
  height: 45,
  marginTop: 10,
  backgroundColor: 'transparent',
},
})

