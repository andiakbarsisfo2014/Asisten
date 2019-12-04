
import React from 'react';
import {ActivityIndicator, InteractionManager, Image, RefreshControl, AsyncStorage, FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import ConfigAPI from './config/ConfigAPI';


export default class Approved extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : () => <Judul judul={navigation.state.params.judul+' '+navigation.state.params.title} />,
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
            isLoading : true,
            wrong : false,
            users : [],
            token : '',
            smgError : '',
            isRefresh : false,
        }
    }

    

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.makeRequest();
        });
    }

    makeRequest = () => {
        var kode_kelas = this.props.navigation.state.params.key;
        AsyncStorage.getItem('attrLogin').then((value) => {
            var token = JSON.parse(value).token;
            this.setState({token : token});
            this.doRequest(token);
        });
    }

    doRequest = (token = undefined) => {
        var a = fetch(ConfigAPI.link + 'semua-laporan-mobile', {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            },
            body : JSON.stringify({
                kode_kelas : this.props.navigation.state.params.key
            })
        }).then(response => response.json()).then(response => this.jsonParse(response)).catch(error => this.error(error));
    }

    error = (error) => {
        this.setState({
            isLoading : false,
            wrong : true,
            smgError : error
        })
    }

    jsonParse = (json) => {
        this.setState({
            isLoading : false,
            wrong : false,
            // users : json.response.data
        });
        this.props.dispatch({type : 'initValue', data : json.response.data})
    }

    errorPage = () => {
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

    refresh = () => {
        // this.setState({
        //   currentPost : 1,
        //   isLoading : true,
        //   users : [],
        //   endOfRecord : false,
        // }, () => {
        //   this.getItem(0)
        // })
    }

    btnRefresh = () => {
        this.setState({
            isLoading : true,
            wrong : false,
        }, () => {
            this.getItem(0)
        })
    }

    render(){
        if (this.state.isLoading) {
            return (
                <View style={{flex : 1, flexDirection : 'column'}}>
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View>
                </View>
            )
        }
        else{
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    {
                        this.state.wrong ? this.errorPage() : 
                        <FlatList
                            style={{backgroundColor : '#D1D1D1'}}
                            data ={this.props.dataLaporan}
                            refreshControl = {
                                <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRefresh} onRefresh={this.refresh} />
                            }
                            initialNumToRender={7}
                            showsVerticalScrollIndicator = {false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem = { ({item, index}) => (
                                <Item index={index} navigation={this.props.navigation} key={item.key} items={item} kode_kelas={this.props.navigation.state.params.key} />
                            )}
                        />
                    }
                </View>
            )
        }
    }
}

class Item extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            users : this.props.items.file != undefined ? this.props.items.file : [],
            mhs : {
                img : this.props.items.img,
                kelas : this.props.items.kelas,
                nama : this.props.items.nama,
                nim : this.props.items.nim,

            }
        }
    }
    
    render (){
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ItemLaporan', { index : this.props.index, judul : this.props.navigation.state.params.title, mhs : this.state.mhs, kode_kelas : this.props.items.key})} style={{backgroundColor : '#FFF', height : 70, marginVertical : 5, flex : 1, flexDirection : 'column'}}>
                <View style={{flex : 1, flexDirection : 'row', paddingHorizontal : 10, paddingVertical : 10, }}>
                    <View style={{height : 50,  width : 50, justifyContent : 'center', alignItems : 'center'}}>
                        <Image style={{width: 50, height: 50, borderRadius : 50,}} source={this.props.items.img != null ? { uri: ConfigAPI.img_url+'/public'+this.props.items.img } : require('./component/logo.png') } />  
                    </View>
                    <View style={{height : 50, alignSelf : 'stretch', paddingHorizontal : 10,}}>
                        <Text numberOfLines={2} style={{fontWeight : 'bold', fontSize : 16}}>{this.props.items.nama}</Text>
                        <Text style={{color : '#BABABA'}}>{this.props.items.nim + ' - ' +this.props.items.kelas}</Text> 
                    </View>
                </View>
            </TouchableOpacity>
      )
    }
  }

  class ItemLaporan extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    readFile = (file) => {
        this.props.navigation.navigate('PdfRead', {fileName : ConfigAPI.img_url + '/public' + file});
    }



    render (){

        return(
            <View style={css.box}>
                <View style={css.labelLaporan}>
                    <Text>Laporan Ke.{this.props.items.row} - { this.props.items.name != undefined && this.props.items.acc == 0 ? 'Wait' : this.props.items.acc == 2 ? 'Reject' : this.props.items.name != undefined && this.props.items.acc == 1 ? 'Acc' : 'Kosong' }</Text>
                </View>
                <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around'}}>
                    <TouchableOpacity style={css.bundar} onPress={() => this.readFile(this.props.items.name)}>
                        <Icon name="check-square" color="#fff"  type="font-awesome" />
                    </TouchableOpacity>
                    <TouchableOpacity style={css.bundar}>
                        <Icon name="ban" color="#fff"  type="font-awesome" />
                    </TouchableOpacity>
                    <TouchableOpacity style={css.bundar}>
                        <Icon name="eye" color="#fff"  type="font-awesome" />
                    </TouchableOpacity>
                </View>
            </View>
        )
        
    }
}


class Judul extends React.PureComponent {
    render() {
      return (
        <Text style={{fontWeight : 'bold', fontSize : 16, color : '#fff' }}> {this.props.judul} </Text>
      )
    }
  }

const css = StyleSheet.create({
    box : {
        flex : 1,
        flexDirection : 'column',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        height : 100, width : 200, marginLeft : 5, marginRight : 5,
    },
    bundar : {backgroundColor : '#D1D1D1', height : 40, width : 40, borderRadius : 60, justifyContent : 'center', },
    labelLaporan : {flex : 1, alignItems : 'center', justifyContent : 'center'}
})
