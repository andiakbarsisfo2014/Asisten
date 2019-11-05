import React from 'react';
import {View, Text, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';

export default class Setting extends React.Component {
	static navigationOptions = ({ navigation }) => {
        return {
            title: 'Asisten',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerRight : (
                <View style={{ flex : 1, alignItems : 'center', flexDirection : 'row', justifyContent : 'space-between'}}>
                    <TouchableHighlight style={css.rightComponent} onPress={() => navigation.getParam('logot')()}>
                        <Icon name="qrcode" type="font-awesome" color="#fff" />
                    </TouchableHighlight>
                    <View style={css.rightComponent}>
                        <Icon name="sign-out" type="font-awesome" color="#fff" onPress={() => navigation.getParam('logot')()} />
                    </View>
                </View>
            )
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
        const { navigation } = this.props;
        navigation.setParams({
            logot: this.logot,
        })
        this.showProfile();
    }

    logot = async () => {
       await AsyncStorage.clear();
       this.props.navigation.navigate('Auth');
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
const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    }
})               
                    
