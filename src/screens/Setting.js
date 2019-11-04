import React from 'react';
import {View, Text, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';

export default class Setting extends React.Component {
	static navigationOptions = ({ navigation }) => {
        return {
            title: 'Settings',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
	constructor(props){
        super(props);
        this.state = {
            isLoading : true,
            showError : false,
            loadingList : true,
            isRefresh : false,
            nim : '',
            nama : '',
            img : '',
            token : '',

        }
    }
    
    componentDidMount(){
        this.showProfile();
    }

    showProfile = async () => {
        var token;
        await AsyncStorage.getItem('attrLogin').then((v) => {
            var res = JSON.parse(v);
            token = res.token;
            this.setState({
                nama : res.name,
                img : res.img,
                isLoading : false,
            });
        });
    }

    render () {
    	return(
    		<HeaderNilai attribute={{nim : '60900114063', name : 'Selamat Datang - '+this.state.nama, avatar_url : this.state.img}} />
    	)
    }
}                   
                    
