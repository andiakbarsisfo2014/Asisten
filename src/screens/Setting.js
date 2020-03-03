import React from 'react';
import {NativeModules} from 'react-native';
import {View, Text, Image, Modal, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button, Input} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigApi from './config/ConfigAPI';

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
            token: null,
            pertemuan :  0,
            isVisible: false,
            pertemuanVisible: false,
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
        AsyncStorage.getItem('attrLogin').then((v) => {
            var res = JSON.parse(v);
            let token = res.token;
            this.setState({
                token: res.token,
            });
        });
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
            this.setState({pertemuanVisible : false});
        }
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
    	return(
            <View style={{backgroundColor:"#004dcf" }}>
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
                        <View style={styles.boxLabel}>
                            <View style={styles.containerBox}>
                                <View style={styles.boxIcon}>
                                    <Icon name='ios-eye' type='ionicon' color='#517fa4' size={40} />
                                </View>
                                <View style={styles.boxText}>
                                    <Text style={styles.caption}>Pertemuan</Text>
                                    <Text>{this.state.pertemuan}</Text>
                                </View> 
                            </View>                   
                            <View style={styles.boxIcon}>
                                <TouchableHighlight style={styles.actButton} underlayColo="red" onPress={()=>this.setState({pertemuanVisible: true})}>
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.pertemuanVisible}
                >
                    <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>

                    </TouchableOpacity>
                </Modal>
                <Modal
                    onShow={()=>this.setState({alreadyShow: true})}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.pertemuanVisible}
                    onOrientationChange="overFullScreen"
                    onRequestClose={() => this.setState({pertemuanVisible: false, alreadyShow: false}) }>
                    <View style={{flex:1, flexDirection: 'column-reverse'}}>
                        <View style={{height:180, backgroundColor: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                            <View style={{marginTop: 15, marginLeft: 20}}>
                                <Text style={{fontWeight: 'bold', fontSize: 17}}>Masukkan Kata Sandi</Text>
                            </View>
                            <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                                <Input keyboardType={'numeric'} onSubmitEditing={() => this.simpan_pertemuan()} returnKeyType='send' onChange={(event) => this.setState({pertemuan: event.nativeEvent.text})} placeholder='Pertemuan' />
                            </View>
                            {/* <View style={{marginTop: 15, marginLeft: 15, marginRight: 15, alignItems: 'flex-end'}}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <TouchableOpacity style={{width: 70, height: 50}} onPress={()=>this.setState({isVisible: false})}>
                                        <Text style={{color: '#517fa4', fontWeight: 'bold', fontSize: 15}}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.sendData} style={{width: 70, height: 50}}>
                                        <Text style={{color: '#517fa4', fontWeight: 'bold', fontSize: 15}}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                        </View>
                    </View>
                </Modal>
            </View>
            // <View style={{flex : 1, flexDirection : 'column'}}>
            //     <HeaderNilai navigation={this.props.navigation} attribute={{nim : '60900114063', name : 'Selamat Datang - '+this.props.imageLogin['_55'].name , avatar_url : this.props.imageLogin['_55'].img}} />
            //     <View style={{flex : 1, flexDirection : 'row', height : 50,}}>
            //         <View style={{height : 50, flex : 1, flexDirection : 'row', backgroundColor : '#fff', justifyContent : 'space-around', borderBottomWidth : 1, borderBottomColor : '#E0E5EA'}}>
            //             <View style={css.labelMenu}>
            //                 <Text>Pertemuan Ke : {this.state.pertemuan}</Text>
            //             </View>
            //             <View style={css.btnMenu}>
            //                 <TouchableHighlight underlayColor="#E0E5EA" style={css.btnRounde} onPress={ () => this.ubahPertemuan()}>
            //                     <Icon name="pencil" type="font-awesome" color="blue"   />
            //                 </TouchableHighlight>
            //             </View>
            //         </View>
            //     </View>
            //     <Modal
            //         animationType="slide"
            //         transparent={true}
            //         style={{flex :1, flexDirection : 'column-reverse'}}
            //         visible={this.state.modalVisible}
            //         onRequestClose={() => {
            //             this.setState({modalVisible : false})
            //         }}>
            //         <View style={css.modal}>
            //             <View style={css.headerModal}>
            //                 <Text style={css.label}>Pertemuan</Text>
            //             </View>
            //             <View style={css.bodyModal}>
            //                 <View style={css.inputInline}>
            //                     <Input
            //                         keyboardType={'numeric'}
            //                         label = "Pertemuan Ke : "
            //                         onChange={(e) => this.setState({pertemuan : e.nativeEvent.text}) }
            //                         value={this.state.pertemuan}
            //                     />
            //                 </View>
            //                 <View style={css.buttonInline}>
            //                     <Button title="Simpan" onPress={() => this.simpan_pertemuan()} />
            //                 </View>
            //             </View>
            //         </View>
            //     </Modal>
            // </View>            
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
                    
