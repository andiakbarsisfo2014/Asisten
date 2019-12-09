import React from 'react';
import {NativeModules} from 'react-native';
import {View, Text, Modal, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button, Input} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';

import AsistensService from '../../AsistensService';

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
            pertemuan :  0,
            modalVisible : false,
        }
    }
    
    componentDidMount(){
        const { navigation } = this.props;
        navigation.setParams({
            logot: this.logot,
        });
        AsistensService.getPertemuan(
            (status) => {
                this.setState({pertemuan : status, isLoading : false})
            }
        )
        // this.showProfile();
    }


    logot = async () => {
       await AsyncStorage.clear();
       this.props.navigation.navigate('Auth');
    }

    showProfile = async () => {
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

    ubahPertemuan = () => {
        this.setState({modalVisible : true})
    }

    simpan_pertemuan = () => {
        if (this.state.pertemuan > 10 || this.state.pertemuan < 1) {
            alert('Pertemuan tidak valid')
        }
        else{
            AsistensService.setPertemuan(this.state.pertemuan);
            this.setState({modalVisible : false});
        }
    }

    render () {
    	return(
            <View style={{flex : 1, flexDirection : 'column'}}>
                <HeaderNilai navigation={this.props.navigation} attribute={{nim : '60900114063', name : 'Selamat Datang - '+this.props.imageLogin['_55'].name , avatar_url : this.props.imageLogin['_55'].img}} />
                <View style={{flex : 1, flexDirection : 'row', height : 50,}}>
                    <View style={{height : 50, flex : 1, flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'space-around', borderBottomWidth : 1, borderBottomColor : '#E0E5EA'}}>
                        <View style={css.labelMenu}>
                            <Text>Pertemuan Ke : {this.state.pertemuan}</Text>
                        </View>
                        <View style={css.btnMenu}>
                            <TouchableHighlight underlayColor="#E0E5EA" style={css.btnRounde} onPress={ () => this.ubahPertemuan()}>
                                <Icon name="pencil" type="font-awesome" color="blue"   />
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{flex :1, flexDirection : 'column-reverse'}}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible : false})
                    }}>
                    <View style={css.modal}>
                        <View style={css.headerModal}>
                            <Text style={css.label}>Pertemuan</Text>
                        </View>
                        <View style={css.bodyModal}>
                            <View style={css.inputInline}>
                                <Input
                                    keyboardType={'numeric'}
                                    label = "Pertemuan Ke : "
                                    onChange={(e) => this.setState({pertemuan : e.nativeEvent.text}) }
                                    value={this.state.pertemuan}
                                />
                            </View>
                            <View style={css.buttonInline}>
                                <Button title="Simpan" onPress={() => this.simpan_pertemuan()} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>            
        ) 
    }
}    
const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    },
    labelMenu : {width : 270, height : 40, justifyContent : 'center'},
    btnMenu : {width : 40, height : 40, justifyContent : 'center'},
    btnRounde : {
        borderRadius : 60,
        height : 45,
        width : 45,
        justifyContent : 'center'
    },
    modal : {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginTop: 450, 
        height : 220, 
        backgroundColor : '#E0E5EA', 
        borderTopEndRadius : 25, 
        borderTopStartRadius : 25,
        flex : 1, 
        flexDirection : 'column'
    },
    headerModal : {
        alignItems : 'center',
        marginTop : 10,  
    },
    bodyModal : {
        flex : 1,
        flexDirection : 'row',
        marginHorizontal : 10,
        marginVertical : 30,
    },
    label : {
        fontSize : 20,
        fontWeight : 'bold'
    },
    inputInline : {
        width : 250,
    },
    buttonInline : {
        width : 80,
        justifyContent : 'center'
    }
})               
                    
