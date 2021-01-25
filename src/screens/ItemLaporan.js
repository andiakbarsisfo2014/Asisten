
import React from 'react';
import {ActivityIndicator, InteractionManager, Image, RefreshControl, AsyncStorage, FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import ConfigAPI from './config/ConfigAPI';

export default class ItemLaporan extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : () => <Judul judul={'Laporan - ' +navigation.state.params.judul} />,
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            laporan : [],
            mhs : this.props.navigation.state.params.mhs,
            token : null,
            isFirst : true,
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            AsyncStorage.getItem('attrLogin').then((value) => {
                var token = JSON.parse(value).token;
                this.setState({token : token, isFirst : false });
            });
        })
        

    }

    readFile = (file) => {
        this.props.navigation.navigate('PdfRead', {fileName : ConfigAPI.img_url + '/public' + file});
    }

    dispatch = (indexLaporan, typeAcc) => {
        this.props.dispatch({type : 'changeStatus', data : {typeAcc : typeAcc, indexUser : this.props.navigation.getParam('index'), indexLaporan : indexLaporan}})
    }

    render (){        
        if (!this.state.isFirst) {
            return(
                <FlatList 
                    data={this.props.dataLaporan[this.props.navigation.getParam('index')].file}
                    numColumns={2}
                    ListHeaderComponent = { <HeaderLaporan mhs={this.state.mhs} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = { ({item, index}) => (
                        <Items propsRedux={this.dispatch} navigation={this.props.navigation} token={this.state.token} index={index} laporan={item} mhs={this.state.mhs} />
                    )}
                />
            )
        }
        else{
            return (
                <View style={{flex : 1, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator />
                </View>
            )
        }
        
    }
}

class HeaderLaporan extends React.PureComponent {
    render(){
        return(
            <View style={{flex : 1, flexDirection : 'row', paddingHorizontal : 10, paddingVertical : 10, }}>
                <View style={{height : 50,  width : 50, justifyContent : 'center', alignItems : 'center'}}>
                    <Image style={{width: 50, height: 50, borderRadius : 50,}} source={this.props.mhs.img != null ? { uri: ConfigAPI.img_url+'/public'+this.props.mhs.img } : require('./component/logo.png') } />  
                </View>
                <View style={{height : 50, alignSelf : 'stretch', paddingHorizontal : 10,}}>
                    <Text numberOfLines={2} style={{fontWeight : 'bold', fontSize : 16, color: '#517fa4'}}>{this.props.mhs.nama}</Text>
                    <Text style={{color : '#BABABA'}}>{this.props.mhs.nim + ' - ' +this.props.mhs.kelas}</Text> 
                </View>
            </View>
        )
    }
}

class Items extends React.PureComponent {
    
    constructor (props) {
        super(props);
        this.state = {
            isRequest : false,
            error : false,
            kode_kelas : this.props.navigation.state.params.kode_kelas,
            row : this.props.laporan.row,
            name : this.props.laporan.name,
            acc : this.props.laporan.acc,
            typeAcc : 0,
        }
    }


 
    readFile (file, ke) {
        this.props.navigation.navigate('PdfRead', {fileName : ConfigAPI.img_url + '/public' + file, rowFile : ke});
    }

    sendReport = (type) => {
        
        this.setState({
            isRequest : true,
            error : false,
            typeAcc : type,
        })
        fetch (ConfigAPI.link + 'acc-laporan', {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : this.props.token,
            },
            body : JSON.stringify({
                kode_kelas : this.state.kode_kelas,
                ke : this.props.laporan.row,
                acc : type,
            })
        }).then(response => response.json()).then(response => this.jsonResponse(response, type)).catch(error => this.error(error, type))
    }

    jsonResponse = (json, type) => {
        this.setState({
            isRequest : false,
            error : false,
            acc : type
        });
        this.props.propsRedux(this.props.index, type );
    }

    error = (error, type) => {
        console.log(error);
        this.setState({
            isRequest : false,
            error : true,
            acc : type
        })
    }
    

    render () {
        if (this.state.isRequest) {
            return (
                <View style={css.box}>
                    <View style={css.labelLaporan}>
                        <Text>Mengirim laporan {this.props.laporan.row} ..</Text>
                    </View>
                    <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around'}}>
                        <ActivityIndicator color="#004dcf" />
                    </View>
                </View>
            )
        }
        else if (this.state.error) {
            return (
                <View style={css.box}>
                    <View style={css.labelLaporan}>
                        <Text>Mengirim laporan {this.props.laporan.row} ..</Text>
                    </View>
                    <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around'}}>
                        <Button
                            onPress={ () => this.sendReport(this.state.typeAcc)}
                            icon = {
                                <Icon
                                    name="sync"
                                    size={15}
                                    color="white"
                                />
                            }
                        />
                    </View>
                </View>
            )
        }
        else{
            return (
                <View style={css.box}>
                    <View style={css.labelLaporan}>
                        <Text style={{color: '#517fa4', fontWeight: 'bold'}}>Laporan Ke.{this.state.row} - { this.state.name != undefined && this.state.acc == 0 ? 'Wait' : this.state.acc == 2 && this.state.name == undefined ? 'Reject' : this.state.name && this.state.acc == 1 ? 'Acc' : 'Kosong' }</Text>
                    </View>
                    <View style={{flex : 1, flexDirection : 'row', justifyContent : 'space-around'}}>
                        <TouchableOpacity onPress={ () => this.sendReport(1) } disabled={this.state.acc == 1 || this.state.name == undefined ? true : false} style={[css.bundar, {borderColor: '#517fa4', borderWidth: 1}]}>
                            <Icon name="check-square" color="#517fa4"  type="font-awesome" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.sendReport(2) } disabled={this.props.laporan.name != null ? false : true} style={[css.bundar, {borderColor: '#517fa4', borderWidth: 1}]}>
                            <Icon name="ban"  color="#517fa4"  type="font-awesome" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.readFile(this.state.name, this.state.row)} disabled={this.state.name ? false : true} style={[css.bundar, {borderColor: '#517fa4', borderWidth: 1}]}>
                            <Icon name="eye"  color="#517fa4"  type="font-awesome" />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }        
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
        height : 100, width : 200, marginLeft : 5, marginRight : 5, marginTop : 5
    },
    bundar : {height : 40, width : 40, borderRadius : 60, justifyContent : 'center', },
    labelLaporan : {flex : 1, alignItems : 'center', justifyContent : 'center'}
})