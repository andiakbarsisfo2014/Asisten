import React from 'react';
import {View, Text, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';
// import { ThemeColors, useTheme } from 'react-navigation';

export default class Praktikum extends React.Component {
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
            matkul : [],
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
        this.listPraktikum(token)        
    }

    listPraktikum = async (token) => {
        var result = await fetch(ConfigAPI.link+'get-kelas-mobile',{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            }
        });
        if (result.status == 200) {
            var json = await result.json();
            var ret = await this.uraiJSON(json);
        }
        else{
            this.setState({
                loadingList : false,
                showError : true,
                msgError : 'Terjadi kesalahan - '+result.status
            })  
        }
    }

    uraiJSON = async (json) => {
        var arr = [];
        if (json.response.length > 0) {
            for (let index = 0; index < json.response.length; index++) {
                var ob = new Object();
                ob.title = json.response[index].praktikum;
                ob.key = json.response[index].kode_kelas;
                ob.kelas = json.response[index].kelas;
                arr.push(ob);
            }
            this.setState({
                matkul : arr,
                loadingList : false,
                isRefresh : false,
                showError : false,
            })   
        }
        else{
            this.setState({
                loadingList : false,
                showError : true,
                isRefresh : false,
                msgError : 'Praktikum tidak tersedia'
            })  
        }
    }

    absen = (key, title, kelas) => {
        this.props.navigation.navigate('Home',{key : key, title : title, kelas : kelas})
    }

    qrCode = () => {
        this.props.navigation.navigate('QrCode');
    }
    
    logot = async () => {
       await AsyncStorage.clear();
       this.props.navigation.navigate('Auth');
    }

    refresh = () => {
        this.setState({
            isRefresh : true,
        }, () => {
            this.showProfile();
        })
    }

    rightComponent = () => {
        return(
            <View style={{ flex : 1, alignItems : 'center', flexDirection : 'row', justifyContent : 'space-between'}}>
                <View style={{flex : 1, borderRadius : 60,}}>
                    <Icon name="qrcode" type="font-awesome" color="#fff" onPress={() => this.qrCode()} />
                </View>
                <View style={{flex : 1}}>
                    <Icon name="sign-out" type="font-awesome" color="#fff" onPress={() => this.logot()} />
                </View>
            </View>
        )
    }

    error = () => {
        return(
            <View  style={{flex : 1, justifyContent : "center", alignItems : 'center', }}>
                <View elevation={5} style={{height : 150, width : 250, justifyContent : "center", alignItems : 'center', padding:20,
                    backgroundColor:'#d9d9d9', shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 2, 
                    shadowOffset: {
                        height: 1,
                    width: 1
                    }
                }}>
                    <Text>{this.state.msgError}</Text>
                    <Button title="Reload" />
                </View>
            </View>
        )
      }
    
    render (){
        if (this.state.isLoading) {
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    {/*<Header
                        leftComponent={{icon : 'buysellads', type: 'font-awesome', color : '#fff'}}
                        centerComponent={{ text: 'Asisten App', style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
                        rightComponent={this.rightComponent()}
                    /> */}
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View>
                </View>
            )
        }
        else{
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    { this.state.loadingList ? <ActivityIndicator /> : this.state.showError ? this.error() : <FlatList 
                        data ={this.state.matkul}
                        refreshControl = {
                            <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRefresh} onRefresh={this.refresh} />
                          }
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = {({item}) => (
                            <ListItem 
                                leftIcon={{name : 'cogs', type : 'font-awesome'}}
                                title={item.title}
                                subtitle={'Kelas : '+item.kelas}
                                onPress={() => this.absen(item.key, item.title, item.kelas)}
                                bottomDivider
                            />
                        )}
                    /> }
                </View>
            )
        }
    }
}

const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    }
})
