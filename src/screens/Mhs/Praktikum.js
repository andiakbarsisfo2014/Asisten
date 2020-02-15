import React from 'react';
import { Overlay } from 'react-native-elements'
import {Text, ToastAndroid, View, RefreshControl, TouchableHighlight, Dimensions, ActivityIndicator, FlatList, StatusBar, AsyncStorage, InteractionManager } from 'react-native';
import {ListItem, Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import ConfigAPI from '../config/ConfigAPI';
import AsistenService from '../../../AsistensService';

class Template extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isActive : false,
        }
    }
    set_active_view () {
        // alert()
        this.props.set_active_view(this.props.index);
    }

    render () {
        return (
            <TouchableHighlight underlayColor="#fff" style={{
                flex : 1, 
                flexDirection : 'row', 
                // backgroundColor : '#747474',
                borderColor : this.props.index == this.props.active ? '#004dcf' : '#747474',
                borderWidth : 1,
                margin : 10,
                width : (Dimensions.get('window').width / 6), height : 50,
                justifyContent : 'center',
                alignItems : 'center', borderRadius : 5
            }} onPress={ () => this.set_active_view()}>
                <View>
                <Icon name={this.props.item.icon} type="font-awesome" color={this.props.index == this.props.active ? '#004dcf' : '#747474'} />
                    <Text style={{color : this.props.index == this.props.active ? '#004dcf' : '#747474'}}>{this.props.item.title}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export default class Praktikum extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Praktikum',
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
            isRequest : true,
            isFailed : false,
            isActive : false,
            showAlert : false,
            isFetching: false,
            isRequestNilai : false,
            kode_kelas : null,
            active : -1,
            dataSource : [],
            menu : [
                {
                    title : 'TP',
                    name : 'Tp',
                    icon : 'home'
                },
                {
                    title : 'Respon',
                    name : 'Respon',
                    icon : 'reply'
                },
                {
                    title : 'Tugas',
                    name : 'Tugas',
                    icon : 'building'
                },
                {
                    title : 'Quis',
                    name : 'Quis',
                    icon : 'globe'
                },
                {
                    title : 'Laporan',
                    name : 'Laporan',
                    icon : 'bug'
                },
                {
                    title : 'Absen',
                    name : 'Absen',
                    icon : 'at'
                },
            ],
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.doRequest();
        });
    }

    set_active_view = (index) => {
        // alert(index);
        this.setState({isActive : true, active : index});
    }

    doRequest = () => {
        AsyncStorage.getItem('attrLogin').then( (value) => {
            let json = JSON.parse(value);
            fetch(ConfigAPI.link + 'get-my-praktikum-mobile', {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization : json.token,
                }
            }).then(response => response.json())
            .then( (response) => {
                this.setState({
                    isFailed : false,
                    isRequest : false,
                    isFetching : false,
                    dataSource : response.data
                })
            }).catch( (error) => {
                console.log(error)
            })
        })
    }

    checkNilai = (kode_kelas, judul) => {
        if (this.props.dataNilaiSiswa == null || this.state.kode_kelas != kode_kelas) {
            if (this.state.active < 0) {
                ToastAndroid.show('Pilih Kategori Nilai !!', ToastAndroid.SHORT);
            } else {
                this.setState({isRequestNilai : true})
                AsyncStorage.getItem('attrLogin').then( (value) => {
                    let json = JSON.parse(value);
                    fetch(ConfigAPI.link + 'get-my-absen', {
                        method : 'POST',
                        headers : {
                            Accept : 'application/json',
                            'Content-Type' : 'application/json',
                            Authorization : json.token,
                        },
                        body : JSON.stringify({
                            kode_kelas : kode_kelas,
                        })
                    }).then(response => response.json())
                    .then( (response) => {
                        this.setState({isRequestNilai : false, kode_kelas : kode_kelas})
                        this.props.dispatch({type : 'setData', data : response.response})
                        let gotoPage = this.state.menu[this.state.active].name;
                        this.props.navigation.navigate(gotoPage, {kode_kelas : kode_kelas});  
                    }).catch( (error) => {
                        this.setState({
                            isRequestNilai : false,
                        });
                        ToastAndroid.show('Terjadi kesalahan', ToastAndroid.SHORT);
                    })
                })
                
            }
        }
        else{
            let gotoPage = this.state.menu[this.state.active].name;
            this.props.navigation.navigate(gotoPage, {kode_kelas : kode_kelas}); 
        }
    }

    onRef = () => {
        this.setState({ kode_kelas : null })
    }

    render(){
        if (this.state.isRequest) {
            return (
                <View style={{flex : 1, flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                    <StatusBar backgroundColor="#004dcf" />
                    <ActivityIndicator color="#004dcf" />
                </View>
            )
        }
        else if (this.state.isFailed) {
            return(
                <View  style={{flex : 1, justifyContent : "center", alignItems : 'center', }}>
                    <StatusBar backgroundColor="#004dcf" />
                    <View elevation={5} style={{height : 150, width : 250, justifyContent : "center", alignItems : 'center', padding:20,
                        backgroundColor:'#d9d9d9', shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 2, 
                        shadowOffset: {
                            height: 1,
                        width: 1
                        }
                    }}>
                        <Text>Terjadi kesalahan</Text>
                        <Button title="Reload" onPress={this.doRequest} />
                    </View>
                </View>
            )
        } 
        else {
            return (
                <View >
                    <StatusBar backgroundColor="#004dcf" />
                    <Button title={"Aaa"} onPress={() => AsistenService.showNotif()}  />
                    {/* <View style={{height : 70}}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data = {this.state.menu}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem = { ({item, index}) => (
                                <Template item={item} index={index} set_active_view={this.set_active_view} active={this.state.active} />
                            )}
                        />
                    </View>
                    
                    <View style={{borderTopWidth : 1, borderTopColor : '#747474'}}>
                        <FlatList
                            data = {this.state.dataSource}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl = {
                                <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRequest} onRefresh={this.doRequest} />
                            }
                            renderItem = { ({item}) => (
                                <ListItem 
                                    leftIcon={{name : 'cogs', type : 'font-awesome'}}
                                    title={item.judul}
                                    subtitle={item.asisten_1.name+' - '+item.asisten_2.name}
                                    onPress={() => this.checkNilai(item.id, item.judul)}
                                    bottomDivider
                                />
                            )}
                        />
                    </View>
                    <Overlay
                        isVisible={this.state.isRequestNilai}
                        onBackdropPress={ () => this.setState({isRequestNilai : false})}
                        width="auto"
                        height="auto">
                        <View>
                            <ActivityIndicator />
                            <Text>Memuat .. </Text>
                        </View>
                    </Overlay> */}
                </View>
            )
        }
    }
}