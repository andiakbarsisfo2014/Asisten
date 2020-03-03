import React from 'react';
import {Text, Modal, AsyncStorage, TextInput, View, StatusBar, Button, StyleSheet, Image, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import ConfigApi from '../config/ConfigAPI';


export default class Profil extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Profil',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    constructor (props) {
        super(props);
        this.state = {
            isVisible: false,
            alreadyShow: false,
            token: '',
            password: null,
            password_confirmation: null,
        }
    }

    componentDidMount () {
        AsyncStorage.getItem('attrLogin').then((v) => {
            var res = JSON.parse(v);
            let token = res.token;
            this.setState({
                token: res.token,
            });
        });
    }

    sendData = () => {
        fetch(ConfigApi.link+'update-my-profile-mobile', {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : this.state.token,
            },
            body : JSON.stringify({
                password: this.state.password,
                password_confirmation: this.state.password_confirmation
            })
        })
        .then(response => response.json())
        .then(response => this.success(response))
        .catch((error) => {

        })
        alert(this.state.password);
    }

    success = (json) => {
        if (json.response.success) {
            this.setState({isVisible: false})
        }
        else{
            alert("Terjadi kesalahan")
        }
    }
    render () {
        return (
            <View style={{backgroundColor:"#004dcf" }}>
                <StatusBar backgroundColor="#004dcf" />
                <ScrollView contentContainerStyle={{ backgroundColor: '#fff'}}>
                    <View style={styles.header}></View>
                    <Image style={styles.avatar} source={{uri: this.props.imageLogin._55.img != undefined ? ConfigApi.img_url+'/public'+this.props.imageLogin._55.img :  'https://bootdey.com/img/Content/avatar/avatar6.png'}} />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GambarPage')} style={{backgroundColor: '#fff', borderColor: '#517fa4', borderWidth: 2, borderRadius: 100,  height: 50, width: 50, marginTop: 25, marginLeft: '55%'}}>
                        <Icon name="ios-camera" size={40} type="ionicon" color='#517fa4'  />
                    </TouchableOpacity>
                    <View style={styles.boxStyle}>
                        <View style={styles.boxLabel}>
                            <View style={styles.containerBox}>
                                <View style={styles.boxIcon}>
                                    <Icon name='ios-contact' type='ionicon' color='#517fa4' size={40} />
                                </View>
                                <View style={styles.boxText}>
                                    <Text style={styles.caption}>Nama</Text>
                                    <Text>{this.props.imageLogin._55.name}</Text>
                                </View> 
                            </View>                   
                            {/* <View style={styles.boxIcon}>
                                <TouchableHighlight style={styles.actButton} underlayColo="red" onPress={()=>this.setState({isVisible: true})}>
                                    <Icon name='md-create' type='ionicon' color='#517fa4' size={20} />
                                </TouchableHighlight>
                            </View> */}
                        </View>
                        <View style={styles.boxLabel}>
                            <View style={styles.containerBox}>
                                <View style={styles.boxIcon}>
                                    <Icon name='ios-lock' type='ionicon' color='#517fa4' size={40} />
                                </View>
                                <View style={styles.boxText}>
                                    <Text style={styles.caption}>Kata Sandi</Text>
                                    <Text>*********</Text>
                                </View> 
                            </View>                   
                            <View style={styles.boxIcon}>
                                <TouchableHighlight style={styles.actButton} underlayColo="red" onPress={()=>this.setState({isVisible: true})}>
                                    <Icon name='md-create' type='ionicon' color='#517fa4' size={20} />
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    style={{backgroundColor: 'yellow'}}
                    visible={this.state.isVisible}
                >
                    <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>

                    </TouchableOpacity>
                </Modal>
                <Modal
                    onShow={()=>this.setState({alreadyShow: true})}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                    onOrientationChange="overFullScreen"
                    onRequestClose={() => this.setState({isVisible: false, alreadyShow: false}) }>
                    <View style={{flex:1, flexDirection: 'column-reverse'}}>
                        <View style={{height:280, backgroundColor: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                            <View style={{marginTop: 15, marginLeft: 20}}>
                                <Text style={{fontWeight: 'bold', fontSize: 17}}>Masukkan Kata Sandi</Text>
                            </View>
                            <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                                <Input onChange={(event) => this.setState({password: event.nativeEvent.text})} secureTextEntry={true} placeholder='Sandi' />
                            </View>
                            <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                                <Input onChange={(event) => this.setState({password_confirmation: event.nativeEvent.text})} secureTextEntry={true} placeholder='Konfirmasi sandi' />
                            </View>
                            <View style={{marginTop: 15, marginLeft: 15, marginRight: 15, alignItems: 'flex-end'}}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <TouchableOpacity style={{width: 70, height: 50}} onPress={()=>this.setState({isVisible: false})}>
                                        <Text style={{color: '#517fa4', fontWeight: 'bold', fontSize: 15}}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.sendData} style={{width: 70, height: 50}}>
                                        <Text style={{color: '#517fa4', fontWeight: 'bold', fontSize: 15}}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#004dcf",
        height:140,
    },
    boxStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50,
        // paddingBottom: 50,
        marginTop: 40
    },  
    caption: {
        fontSize: 16,
        color: '#517fa4',
        fontWeight: 'bold'
    },
    actButton: {
        height: 30, width: 30,
        justifyContent: 'center',
        borderRadius: 100
    },  
    boxLabel: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#517fa4'

    }, 
    boxIcon: {
        justifyContent: 'center', alignItems: 'center',
        height:50, width: 50,
    },
    boxText: {
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15

    },
    containerBox: {
        flexDirection: 'row',
        flex: 1,
        height: 60,
        marginRight: 5,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:80
    }
});