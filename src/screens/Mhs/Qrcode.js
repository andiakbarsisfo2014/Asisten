import React from 'react';
import {Text, View, StatusBar, ActivityIndicator, AsyncStorage} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ConfigAPI from '../config/ConfigAPI';


export default class Qrcode extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Absen Qr-Code',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            textCode : '',
        }
    }
    componentDidMount () {
        AsyncStorage.getItem('attrLogin').then( (value) => {
            let json = JSON.parse(value);
            fetch(ConfigAPI.link + 'request-qr-code', {
                method : 'GET',
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization : json.token,
                }
            }).then(response => response.json())
            .then( (response) => {
                this.setState({
                    isLoading : false,
                    textCode : response.response.data
                });
            }).catch( (error) => {
                console.log(error)
            })
        })
    }

    render(){
        return(
            <View style={{flex : 1, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                
                {
                    this.state.isLoading ? 
                        <ActivityIndicator /> 
                            : 
                        <QRCode 
                            value={this.state.textCode}
                            size={250}
                            color="black"
                        />
                }
            </View>
        )
    }
}