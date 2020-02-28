
import React, {Component} from 'react';
import {ActivityIndicator, Image, RefreshControl, AsyncStorage, FlatList, ScrollView , StyleSheet, Text, Animated, View, PanResponder, Dimensions, TouchableHighlight} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import ConfigAPI from './config/ConfigAPI';
import AsistensService from '../../AsistensService';
const {width} = Dimensions.get('window');


export default class Absen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
        title: navigation.state.params.title,
        headerStyle: {
            backgroundColor: '#004dcf',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        }
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
    var aa = fetch(ConfigAPI.link+'get-mhs',{
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : token,
        },
        body : JSON.stringify({
            kode_kelas : this.props.navigation.state.params.key,
            pertemuan : this.state.pertemuan,
            nilai : 'absen',
        })
    }).then(response  => response.json())
      .then(json => this.jsonParse(json, prosesID));
  }

  jsonParse = (json, prosesID) => {
      if (json.response.length > 0) {
        this.setState({
          isLoading : false,
          isRefresh : false,
          endOfRecord : false,
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
      this.setState({
        currentPost : this.state.currentPost + 1,
      }, () => {
        this.getItem(1);
      })
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
                    // ListFooterComponent={this.footerFlatlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = { ({item}) => (
                        <Item key={item.key} token={this.state.token} pertemuan={this.state.pertemuan} items={item} nilai={this.props} kode_kelas={this.props.navigation.state.params.key} />
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
      statusAbsen : this.props.items.status,
      textStatus : this.props.items.status == undefined ? 'Kosong' : this.props.items.status == 1 ? 'Hadir' : this.props.items.status == 2 ? 'Alfa' : 'Otw',
    }
  }
  absen = (status, id_kelas) => {
    this.setState({isRequest : true});
    var aa = fetch(ConfigAPI.link+'save-absen',{
      method : 'POST',
      headers : {
          'Accept' : 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : this.props.token,
      },
      body : JSON.stringify({
          ke : this.props.pertemuan,
          msh : id_kelas,
          status : status,
      })
    }).then(response  => response.json())
      .then(json => this.success(json, status))
      .catch(() => this.failed())
  }

  success = (json, status) => {
    this.setState({statusAbsen: status, isRequest : false, failed : false, textStatus : status == 1 ?  'Hadir' : status == 2 ? 'Alfa' : 'Otw' });
  }

  failed = () => {
    this.setState({isRequest : true, failed : true});
  }

  render (){
    console.log(this.props.items);
    return(
      
      <View style={{backgroundColor : '#FFF', height : 160, marginVertical : 5, flex : 1, flexDirection : 'column',}}>
        <View style={{flex : 1, flexDirection : 'row', paddingHorizontal : 10, paddingVertical : 10}}>
          <View style={{height : 50, width : 50, justifyContent : 'center', alignItems : 'center'}}>
            <Image style={{width: 50, height: 50, borderRadius : 50,}} source={this.props.items.img != null ? { uri: global.uri +'/public'+this.props.items.img } : require('./component/logo.png') } />  
          </View>
          <View style={{height : 50, alignSelf : 'stretch', paddingHorizontal : 10,}}>
            <Text numberOfLines={2} style={{fontWeight : 'bold', fontSize : 16}}>{this.props.items.nama}</Text>
            <Text style={{color : '#BABABA'}}>{this.props.items.nim + ' - ' +this.props.items.kelas +' - '+ this.state.textStatus}</Text> 
          </View>
        </View>
        <View style={{flex : 1, flexDirection : 'column', marginTop : 15}}>
            {
                this.props.items.allow_absen != undefined ?
                <View style={styles.btnGruop}>
                    <TouchableHighlight underlayColor="#E8E8E8" style={[styles.btnCss, {backgroundColor : this.state.statusAbsen == 1 ? '#D1D1D1' : null } ]} onPress={() => this.absen(1, this.props.items.key)}>
                        <View style={styles.btnContent}>
                            <Icon name="check-square" color="#5BAF5F"  type="font-awesome" />
                            <Text style={styles.iconBtn}>Hadir</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#E8E8E8" style={[styles.btnCss, {backgroundColor : this.state.statusAbsen == 2 ? '#D1D1D1' : null }]} onPress={() => this.absen(2, this.props.items.key)}>
                        <View style={styles.btnContent}>
                            <Icon name="ban" color="#BC3838"  type="font-awesome" />
                            <Text style={styles.iconBtn}>Alfa</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#E8E8E8" style={[styles.btnCss, {backgroundColor : this.state.statusAbsen == 3 ? '#D1D1D1' : null }]} onPress={() => this.absen(3, this.props.items.key)}>
                        <View style={styles.btnContent}>
                            <Icon name="car" color="#004dcf"  type="font-awesome" />
                            <Text style={styles.iconBtn}>Otw</Text>
                        </View>
                    </TouchableHighlight>
                </View> :
                <View style={[styles.btnGruop, {alignItems: 'center', justifyContent: 'center'}]}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>*Pastikan Nilai Terpenuhi</Text>
                </View>
            }
        </View>
        {this.state.isRequest ? <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', flexDirection : 'row', height: 160, width : '100%', position : 'absolute', left : 0, top : 0, backgroundColor : 'rgba(52, 52, 52, 0.2)'}}>
          {!this.state.failed ? <ActivityIndicator size="large" color="#FFF" /> : <Text style={{fontWeight : 'bold'}}>Terjadi kesalahan</Text>}
        </View> : null}
      </View>
    )
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
  btnCss : {height : 35, width : '33%', borderRadius: 5},
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






