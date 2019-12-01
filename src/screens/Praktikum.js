import React from 'react';
import {View, Text, Modal, InteractionManager, ActivityIndicator, RefreshControl, AsyncStorage, TouchableHighlight, FlatList, StyleSheet} from 'react-native';
import {Header, Icon, ListItem, Button} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';
// import { ThemeColors, useTheme } from 'react-navigation';

class Main extends React.Component {
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
            modalVisible : false,
        }
    }
    componentDidMount(){
        const { navigation } = this.props;
        InteractionManager.runAfterInteractions( () => {
            navigation.setParams({
                logot: this.logot,
            })
            this.showProfile();
        })
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
                key : '',
                title : '',
                kelas : '',
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
        this.setState({modalVisible : true, key : key, title : title, kelas : kelas});
        // this.props.navigation.navigate('Home',{key : key, title : title, kelas : kelas})
    }

    qrCode = () => {
        this.props.navigation.navigate('QrCode');
    }

    mulaiProses = (act) => {
        this.setState({modalVisible : false});
        if (act == 'absen') {
            this.props.navigation.navigate('Home',{key : this.state.key, title : this.state.title, kelas : this.state.kelas})
        }
        else if (act == 'tp') {
            this.props.navigation.navigate('Pendahuluan',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'tp', judul : '[ TP ]'})
        }
        else if (act == 'quis') {
            this.props.navigation.navigate('Pendahuluan',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'quis', judul : '[ QUIS ]'})
        }
        else if (act == 'respon') {
            this.props.navigation.navigate('Pendahuluan',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'respon', judul : '[ RES ]'})
        }
        else if (act == 'tugas') {
            this.props.navigation.navigate('Pendahuluan',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'tugas', judul : '[ TUGAS ]'})
        }
        else if (act == 'harian') {
            this.props.navigation.navigate('Pendahuluan',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'harian', judul : '[ Harian ]'})
        }
        else if(act == 'approver'){
            this.props.navigation.navigate('Approver',{key : this.state.key, title : this.state.title, kelas : this.state.kelas, from : 'approver', judul : '[ Approved ]'})
        }
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
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({modalVisible : false})
                        }}>
                        <View style={{backgroundColor : 'rgba(52, 52, 52, 0.7)', justifyContent :'center', alignItems : 'center', flex : 1, flexDirection : 'row'}}>
                            <View style={{backgroundColor : '#fff', height : 415, width : 300, borderRadius : 5}}>
                                <View style={{flex : 1, flexDirection : 'column', padding : 15}}>
                                    <View style={{height : 50, justifyContent : 'center', width : '100%',  borderBottomWidth : 0.5, borderBottomColor : '#464645'}}>
                                        <Text style={{fontWeight : 'bold'}}>Pilih Input Nilai</Text>
                                    </View>
                                    <TouchableHighlight onPress={() => this.mulaiProses('tp')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Nilai Pendahuluan</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('respon')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Nilai Respon</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('quis')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Nilai Quis</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('tugas')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Nilai Tugas</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('harian')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Nilai Harian</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('absen')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Absen</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.mulaiProses('approver')} underlayColor="#E8E8E8"  style={css.container}>
                                        <View style={css.btn}>
                                            <Icon name="check-square" size={30} color="#5BAF5F"  type="font-awesome" />
                                            <Text style={css.label}>Approved Laporan</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>                            
                        </View>
                    </Modal>
                </View>
            )
        }
    }
}

const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    },
    container : {marginTop : 15, flex : 1, flexDirection : 'column'},
    btn : {flex : 1, flexDirection : 'row', alignItems : 'center'},
    label : {fontWeight : 'bold', color : '#464646', fontSize : 15, marginLeft : 10}
})

export default Main
