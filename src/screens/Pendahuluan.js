
import React, {Component} from 'react';
import {ActivityIndicator, Modal, Image, RefreshControl, AsyncStorage, FlatList, TextInput, StyleSheet, Text, View, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Icon, Button, Input, ListItem} from 'react-native-elements';
import ConfigAPI from './config/ConfigAPI';
import AsistensService from '../../AsistensService';
const {width} = Dimensions.get('window');


export default class Pendahuluan extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : () => <Judul judul={navigation.state.params.judul+' '+navigation.state.params.title} />,
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
        };
    };
    constructor(props){
        super(props);
        this.state = {
            currentPost : 1,
            isFinish : false,
            isLoading : true,
            wrong : false,
            smgError : '',
            isRefresh : true,
            isReach : true,
            endOfRecord : false,
            users : [],
            pertemuan :  0,
            token : null,
            nilaiAwal: null,
            posisiUbah: -1,
            uri : ''
        }
        this.onEndReachedCalledDuringMomentum = true;
    }
  
    componentDidMount (){
        AsistensService.getPertemuan(
            (status) => {
                this.setState({pertemuan : status})
            }
        )
        this.getItem(0);
    }

    getItem = (prosesID) => {
        var token1;
        AsyncStorage.getItem('attrLogin').then((value) => {
            var token = JSON.parse(value).token;
            token1 = token;
            this.setState({token : token});
            this.getData(token1, prosesID);
        });
    }

    getData = (token, prosesID) => {
        if (this.props.navigation.state.params.from == 'tugas') {
            var from = 'tugas';
            var uri = ConfigAPI.link + 'store-nilai-tugas';
        } else if (this.props.navigation.state.params.from == 'tp') {
            var from = 'mid';
            var uri = ConfigAPI.link + 'store-nilai-mid';
        }
        else if (this.props.navigation.state.params.from == 'quis') {
            var from = 'quis';
            var uri = ConfigAPI.link + 'store-nilai-quis';
        }
        else if (this.props.navigation.state.params.from == 'respon') {
            var from = 'final';
            var uri = ConfigAPI.link + 'store-nilai-final';
        }
        else if (this.props.navigation.state.params.from == 'harian') {
            var from = 'harian';
            var uri = ConfigAPI.link + 'store-harian';
        }

        var dari = this.props.navigation.state.params.from;
        if (dari == 'tugas' || dari == 'tp') {
            var dataBody = JSON.stringify({
                kode_kelas : this.props.navigation.state.params.key,
                pertemuan : this.state.pertemuan,
                nilai : from,
            })
        }
        else{
            var dataBody = JSON.stringify({
                kode_kelas : this.props.navigation.state.params.key,
                ke : this.state.pertemuan,
                nilai : from,
            })
        }
        fetch(ConfigAPI.link+'get-mhs',{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            },
            body : dataBody,
        })
        .then(response  => response.json())
        .then(json => this.jsonParse(json, prosesID, uri));
    }

    jsonParse = (json, prosesID, uri) => {
        if (json.response.length > 0) {
            this.setState({
                isLoading : false,
                isRefresh : false,
                endOfRecord : false,
                uri : uri,
                users : this.state.users.concat(json.response)
            });
        }
        else{
            this.setState({
                isLoading : false,
                wrong : true,
                isRefresh : false,
                smgError : 'Tidak ada mahasiswa ditemukan',
            })
        }
    }
  
    reach = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.setState({currentPost : this.state.currentPost + 1,}, () => {this.getItem(1);})
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    btnRefresh = () => {
        this.setState({
            isLoading : true,
            wrong : false,
            currentPost : 1,
        }, () => {
            this.getItem(0)
        })
    }

    refresh = () => {
        this.setState({
            currentPost : 1,
            isLoading : true,
            users : [],
            endOfRecord : false,
        }, () => {
            this.getItem(0)
        })
    }

    kirim = (params) => {
        this.setState({posisiUbah: params, nilaiAwal: 100})
        // console.log(this.state.users[params].status = 100)
    }

    render(){
        if (this.state.isLoading) {
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View>
                </View>
            )
        }
        else{
            return (
                <View style={{ flex : 1, flexDirection : 'column'}}>
                {
                    this.state.wrong ? this.error() : 
                    <FlatList
                        style={{backgroundColor : '#D1D1D1'}}
                        data ={this.state.users}
                        refreshControl = {
                        <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRefresh} onRefresh={this.refresh} />
                        }
                        showsVerticalScrollIndicator = {false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({item, index}) => (
                            <Item key={item.key} uri = {this.state.uri} from={this.props.navigation.state.params.from} token={this.state.token} pertemuan={this.state.pertemuan} items={item} nilai={this.props} kode_kelas={this.props.navigation.state.params.key} />
                        )}
                    />
                }
                </View>
            )
        }
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
                    <Text>{this.state.smgError}</Text>
                    <Button title="Reload" onPress={this.btnRefresh} />
                </View>
            </View>
        )
    }

    footerFlatlist = () => {
        return(
            <View style={{height : 50, width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                {this.state.endOfRecord ? <Text>Maximal record</Text> : <ActivityIndicator />}
            </View>
        )
    }
}



class Item extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRequest : false,
      failed : false,
      isLoading : false,
      isVisible: false,
      textStatus : this.props.items.status == undefined ? String(0) : String(this.props.items.status),
    }
  }
  dataBody = (params) => {
    if (this.props.from != 'harian') {
      var body = JSON.stringify({
        mahasiswa : params,
        ke : this.props.pertemuan,
        nilai : this.state.textStatus
      })
      return body; 
    } 
    else{
      var body = JSON.stringify({
        kode_kelas : params,
        ke : this.props.pertemuan,
        nilai : this.state.textStatus
      })
      return body; 
    }
    
    
  }
  absen = (status, id_kelas) => {
    this.setState({isRequest : true, isLoading : true});
    if ( Number(this.state.textStatus) && (Number(this.state.textStatus) >= 0 && Number(this.state.textStatus) <= 100) ) {
      var aa = fetch(this.props.uri,{
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : this.props.token,
        },
        body : this.dataBody(id_kelas),
      }).then(response  => response.json())
        .then(json => this.success(json))
        .catch((error) => this.failed(error))
    } else {
      alert("Pastikan Nilai 0-100");
      this.setState({isRequest : false, isLoading: false});
    }
  }

  success = (json) => {
    console.log(json);
    this.setState({isRequest : false});
    // this.setState({isRequest : false, failed : false, textStatus : status == 1 ?  'Hadir' : status == 2 ? 'Alfa' : 'Otw' });
  }

  failed = (data) => {
    console.log(data);
    this.setState({isRequest : false});
  }

  sendValue = (id_kelas) => {
    if ( Number(this.state.textStatus) && (Number(this.state.textStatus) >= 0 && Number(this.state.textStatus) <= 100) ) {
      this.setState({isRequest : true, isVisible: false});
      var aa = fetch(this.props.uri,{
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : this.props.token,
        },
        body : this.dataBody(id_kelas),
      }).then(response  => response.json())
        .then(json => this.success(json))
        .catch(() => this.failed())
    }
    else{
      alert("Pastikan Nilai 0-100");
    }
  }

    render (){

        return(
      
            <View style={{backgroundColor : '#FFF', height : 80, marginVertical : 1, flex : 1, flexDirection : 'row',}}>
                <View style={{flex : 1, flexDirection : 'row', paddingHorizontal : 10, paddingVertical : 10, borderBottomWidth : 0.5, borderBottomColor : '#D1D1D1'}}>
                    <View style={{height : 50, width : 50, justifyContent : 'center', alignItems : 'center'}}>
                        <Image style={{width: 50, height: 50, borderRadius : 50,}} source={this.props.items.img != null ? { uri: ConfigAPI.img_url+'/public'+this.props.items.img } : require('./component/logo.png') } />  
                    </View>
                    <View style={{height : 50, alignSelf : 'stretch', paddingHorizontal : 10,}}>
                        <Text numberOfLines={2} style={{fontWeight : 'bold', fontSize : 16, color: '#517fa4'}}>{this.props.items.nama}</Text>
                        <Text style={{color : '#BABABA'}}>{this.props.items.nim + ' - ' +this.props.items.kelas +' - '+ this.state.textStatus}</Text> 
                    </View>
                </View>
                <View style={{ width: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>this.setState({isVisible: true})} style={{borderWidth:1, borderColor: '#517fa4', width :25, height: 25, borderRadius: 36, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name='md-create' type='ionicon' color='#517fa4' size={20} />
                    </TouchableOpacity>
                </View>
                
                {this.state.isRequest ? <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', flexDirection : 'row', height: 80, width : '100%', position : 'absolute', left : 0, top : 0, backgroundColor : 'rgba(52, 52, 52, 0.2)'}}>
                {!this.state.failed ? <ActivityIndicator size="large" color="#FFF" /> : <Text>Coba</Text>}
            </View> : null}
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isVisible}
            >
                <View style={{flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>

                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isVisible}
                onOrientationChange="overFullScreen"
                onRequestClose={() => this.setState({isVisible: false, alreadyShow: false}) }>
                <View style={{flex:1, flexDirection: 'column-reverse'}}>
                    <View style={{height:180, backgroundColor: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <View style={{marginTop: 15, marginLeft: 20}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17, color: '#517fa4'}}>Input Nilai: {this.props.items.nama}</Text>
                        </View>
                        <View style={{marginTop: 15, marginLeft: 15, marginRight: 15}}>
                            <Input value={this.state.textStatus} onChange={(event) => this.setState({textStatus: event.nativeEvent.text})} onSubmitEditing={() => this.sendValue(this.props.items.key)} returnKeyType='send' keyboardType='numeric' placeholder='Nilai max-100' />
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
        </View>)
    }
}

const styles = StyleSheet.create({
  listItem: {
    height: 70,
    marginLeft: -100,
    justifyContent: 'center',
  },
  btnGruop : {flex : 6, backgroundColor : '#fff', marginHorizontal : 15, flexDirection : 'row'},
  btnContent : {flexDirection : 'row', flex : 1, alignItems : 'center', justifyContent : 'center'},
  iconBtn : {marginLeft : 10, color : '#545454', fontWeight : 'bold'},
  btnCss : {height : 35, width : '33%'},
  absoluteCell: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 100,
    alignItems : 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  absoluteCellText: {
    margin: 16,
    color: '#FFF',
  },
  innerCell: {
    width: width,
    height: 78,
    paddingHorizontal : 10,
    marginLeft: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  absolutRigth : {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 500,
    // right : 250,
    width: 100,
    alignItems : 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});

class Judul extends React.PureComponent {
  render() {
    return (
      <Text style={{fontWeight : 'bold', fontSize : 16, color : '#fff' }}> {this.props.judul} </Text>
    )
  }
}






