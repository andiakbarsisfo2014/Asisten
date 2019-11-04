
import React, {Component} from 'react';
import {ActivityIndicator, RefreshControl, AsyncStorage, FlatList , StyleSheet, Text, Animated, View, PanResponder, Dimensions} from 'react-native';
import {Header, ListItem, Icon, Button, Divider} from 'react-native-elements';
import Menu, { MenuItem } from 'react-native-material-menu';
import ConfigAPI from './config/ConfigAPI';

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
      users : [
        
      ]
    }
  }
  
  componentDidMount (){
    this.getItem(0);
}

  getItem = async(prosesID) => {
      var token1;
      await AsyncStorage.getItem('attrLogin').then((value) => {
        var token = JSON.parse(value).token;
        token1 = token;
      });
      await this.getData(token1, prosesID);
  }

  getData = async (token, prosesID) => {
    var aa = await fetch(ConfigAPI.link+'get-mhs?page='+this.state.currentPost,{
        method : 'POST',
        headers : {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : token,
        },
        body : JSON.stringify({
            kode_kelas : this.props.navigation.state.params.key,
        })
    });
    if (aa.status == 200) {
        var json = await aa.json();
        await this.jsonParse(json, prosesID);
    }
    else{
        this.setState({
            isLoading : false,
            wrong : true,
            isRefresh : false,
            smgError : 'Terjadi kesalahan',
        })
    }
  }

  jsonParse = async (json, prosesID) => {
      if (json.response.data.length > 0) {
        var arr = [];
        for (let index = 0; index < json.response.data.length; index++) {
            var ob = new Object();
            ob.name = json.response.data[index].mahasiswa.name;
            ob.nim = json.response.data[index].mahasiswa.nim;
            ob.avatar_url = json.response.data[index].mahasiswa.img;
            ob.kelas = json.response.data[index].kelas.nama_kelas;
            arr.push(ob);
        }
        if (prosesID == 0) {
          if (json.response.to > json.response.total) {
            this.setState({
              isLoading : false,
              isRefresh : false,
              endOfRecord : false,
              users : arr
            });
          }
          else{
            this.setState({
              isLoading : false,
              isRefresh : false,
              endOfRecord : true,
              users : arr
            });
          }
          
        }
        else if (prosesID == 1){
          var a = this.state.users;
          if (json.response.to > json.response.total) {
            this.setState({
              isLoading : false,
              isRefresh : false,
              endOfRecord : false,
              users : a.concat(arr)
            });
          }
          else{
            this.setState({
              isLoading : false,
              isRefresh : false,
              endOfRecord : true,
              users : a.concat(arr)
            });
          }
        }
      }
      else{
        if (prosesID == 0) {
          this.setState({
            isLoading : false,
            wrong : true,
            isRefresh : false,
            smgError : 'Tidak ada mahasiswa ditemukan',
          })
        }
      }
  }
  
  reach = () => {
    this.setState({
      currentPost : this.state.currentPost + 1,
    }, () => {
      this.getItem(1);
    })
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
          {/* <Header
              leftComponent={{icon : 'arrow-left', type:'font-awesome', color : '#fff', onPress : () => (this.props.navigation.navigate('Praktikum'))}}
              centerComponent={{ text: this.props.navigation.state.params.title, style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
              rightComponent={{ icon: 'search', color: '#fff' }}
            />  */}
          <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
            <ActivityIndicator size={35} color="grey" />
          </View>
        </View>
      )
    }
    else{
      return (
        <View style={{ flex : 1, flexDirection : 'column'}}>
            {/* <Header
              leftComponent={{icon : 'arrow-left', type:'font-awesome', color : '#fff', onPress : () => (this.props.navigation.navigate('Praktikum'))}}
              centerComponent={{ text: this.props.navigation.state.params.title, style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
              rightComponent={{ icon: 'search', color: '#fff' }}
            /> */}
            {
                this.state.wrong ? this.error() : 
                <FlatList
                    data ={this.state.users}
                    refreshControl = {
                      <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRefresh} onRefresh={this.refresh} />
                    }
                    onEndReachedThreshold={200}
                    onEndReached={ this.reach }
                    showsVerticalScrollIndicator = {false}
                    ListFooterComponent={this.footerFlatlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = { ({item}) => (
                        <Item key={item.nim} items={item} nilai={this.props} kode_kelas={this.props.navigation.state.params.key} />
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

class Item extends React.Component {
  static defaultProps = {
    swipeThreshold: 4,
		swipeOpenThresholdPercentage: 20,
		swipeCloseThresholdPercentage: 20,
		friction: 9,
		tension: 40,
  }
  state = {
    position: new Animated.ValueXY(),
    showIcon : false,
    color : '#fff',
    backgroundColor : '#fff',
    textOutput : '',
	
  };
  constructor (props){
    super(props);
    this._panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (event, gestureState) => this.handleMoveShouldSetPanResponder(event, gestureState),
			onPanResponderGrant: (event, gestureState) => this.handlePanResponderGrant(event, gestureState),
			onPanResponderMove: (event, gestureState) => this.handlePanResponderMove(event, gestureState),
			onPanResponderRelease: (event, gestureState) => this.onPanResponderRelease(event, gestureState),
    });
    this._menu = null;
  }

  handleMoveShouldSetPanResponder = (event, gestureState) => {
		const { dx, dy } = gestureState;
    const { swipeThreshold } = this.props;
		if (Math.abs(dy) > Math.abs(dx)) {
      return false;
		}
		if (Math.abs(dx) < swipeThreshold) {
			return false;
    }
		return true;
  }
  handlePanResponderGrant = (event, gestureState) => {}
  onPanResponderRelease = (evt, gestureState) => {
    if(this.state.position.__getValue().x > 0){
      this.state.position.setOffset({x : 0, y : 0,});
      this.setState({backgroundColor : '#fff'})
      Animated.timing(this.state.position, {
        toValue: {x: 0, y: 0},
        duration: 500,
      }).start(() => {
      });
    }
  }
  handlePanResponderMove = (evt, gestureState) => {
    if((Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) ){
      if(gestureState.dx > 0 && gestureState.dx < 200){
        this.state.position.setValue({x : gestureState.dx, y : 0});
        if (gestureState.dx > 0 &&  gestureState.dx <= 120) {
          this.setState({showIcon : true, color : 'green', backgroundColor : 'green', textOutput : 'Hadir'});
        }
        else if (gestureState.dx > 120 &&  gestureState.dx <= 150){
          this.setState({showIcon : true, color : 'yellow', backgroundColor : 'yellow', textOutput : 'Dalam Perjalanan'});
        }
        else if (gestureState.dx > 150 &&  gestureState.dx < 200) {
          this.setState({showIcon : true, color : 'red', backgroundColor : 'red', textOutput : 'Alfa'});
        }
        // this.props.backToParent(this.props.from);
      }
    }
  }

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  showMenu = () => {
    this._menu.show();
  };

  hideMenu = (param) => {
    this._menu.hide();
    if (param.status == 1) {
      this.props.nilai.navigation.navigate('Laporan', {atribute : param.atribute, status : param.status, kode_kelas : this.props.kode_kelas});
    }
    else if (param.status == 2) {
      this.props.nilai.navigation.navigate('Mid', {atribute : param.atribute, status : param.status, kode_kelas : this.props.kode_kelas});      
    } else if (param.status == 3) {
      this.props.nilai.navigation.navigate('Final', {atribute : param.atribute, status : param.status, kode_kelas : this.props.kode_kelas});      
    }
    // this.props.nilai.navigation.navigate('Nilai', {passParam : param.atribute, status : param.status, kode_kelas : this.props.kode_kelas})
  }

  // showProfile = (param) => {
  //   this.props.profile.navigation.navigate('Nilai', {id : param.nim, nama : param.nama, img : param.img})
  // }
  render (){
    return(
      <Animated.View style={[styles.listItem, {backgroundColor : this.state.backgroundColor}]}>
        <Animated.View style={[this.state.position.getLayout()]} {...this._panResponder.panHandlers}>
          <View style={styles.absoluteCell}>
            <Text style={styles.absoluteCellText}>{this.state.textOutput}</Text>
          </View>
          <View style={styles.innerCell}>
            <ListItem
                subtitle = {this.props.items.nim +' - '+this.props.items.kelas}
                title={this.props.items.name}
                leftAvatar={{ source: this.props.items.avatar_url != null ? { uri: this.props.items.avatar_url } : require('./component/logo.png')  , title : this.props.items.name[0] + this.props.items.name[1]}}
                bottomDivider
                chevron = {
                  <Menu ref={(ref) => this.setMenuRef(ref)} button={<Icon raised size={14} onPress={this.showMenu} name="ellipsis-v" type="font-awesome" color="grey" />}>
                    <MenuItem onPress={() => this.hideMenu({status : 1, atribute : this.props.items})} >Nilai Laporan</MenuItem>
                    <MenuItem onPress={() => this.hideMenu({status : 2, atribute : this.props.items})} >Nilai Mid</MenuItem>
                    <MenuItem onPress={() => this.hideMenu({status : 3, atribute : this.props.items})} >Nilai Final</MenuItem>
                  </Menu>
                }
                rightIcon={this.state.showIcon ? {name : 'user', color : this.state.color, type: 'font-awesome' } : null}
            />
          </View>
        </Animated.View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    height: 60,
    marginLeft: -100,
    justifyContent: 'center',
  },
  absoluteCell: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});






