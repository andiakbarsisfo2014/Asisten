import React, { Component } from "react";

import {Keyboard, Text, View, AsyncStorage, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';

import ConfigAPI from './config/ConfigAPI';


export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            username : '',
            password : '', 
            isLoading : false,
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>Asisten's App</Text>
                            <TextInput placeholder="Username" value={this.state.username} onChange={(e) => this.setState({username : e.nativeEvent.text})} placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
                            <TextInput placeholder="Password" value={this.state.password} onChange={(e) => this.setState({password : e.nativeEvent.text})} placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true}/>
                            <Button
                                buttonStyle={styles.loginButton}
                                onPress={() => this.onLoginPress()}
                                title="Login"
                                loading={this.state.isLoading ? true: false}
                                disabled = {this.state.isLoading ? true : false}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    async onLoginPress() {
        var that = this;
        this.setState({isLoading : true})
        const respons = await fetch(ConfigAPI.link+'login-asisten', {
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
        });
        if (respons.status == 200) {
            that.setState({isLoading : false, username : '', password : ''});
            var msg =  await respons.json();
            AsyncStorage.setItem('isLogin', 'login');
            AsyncStorage.setItem('attrLogin',JSON.stringify({
                login_as : msg.success.login_as,
                name : msg.success.name,
                token : 'Bearer '+msg.success.token,
                img : msg.success.img  
            }));
            this.props.navigation.navigate('App')
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
  marginTop: 150,
  marginBottom: 30,
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

