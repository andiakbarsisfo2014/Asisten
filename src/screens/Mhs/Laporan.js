import React from 'react';
import {Text, View, FlatList, InteractionManager, ActivityIndicator, AsyncStorage} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ConfigAPI from '../config/ConfigAPI';

export default class Absen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Laporan',
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
        super (props);
        this.state = {
            data : [],
            isReady : false,
            isRefresh: false,
        }
    }

    doFecth(kode_kelas){
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
                this.setState({isRefresh : false})
                this.props.dispatch({type : 'setData', data : response.response})
            }).catch( (error) => {
                console.log(error);
                this.setState({
                    isRefresh : false,
                });
                ToastAndroid.show('Terjadi kesalahan', ToastAndroid.SHORT);
            })
        })
    }

    onRefresh() {
        this.setState({isRefresh: true}, () => {this.doFecth(this.props.navigation.state.params.kode_kelas)})
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.setState({isReady : true})
        })
    }

    generateColor = (item) => {
        if(item.acc == 0 && item.file != null) {
            return "#7c6303"
        }
        else if (item.acc == 0 && item.file == null) {
            return "blue"
        }
        else{
            return "green"
        }
    }

    generateText = (item) => {
        if(item.acc == 0 && item.file != null) {
            return "Waiting - "
        }
        else if (item.acc == 0 && item.file == null) {
            return "Empty"
        }
        else{
            return "Acc"
        }
    }

    mySubtitle = (index, item, navigation) => {
        return (
            <View>
                <View>
                    <Text>Batas Upload : {item.tgl == null ? ' - Empty ' : item.tgl} </Text>
                </View>
                <View style={{flex : 1, flexDirection : 'row'}}>
                    <Text style={{fontWeight : 'bold', color : this.generateColor(item)}}>{this.generateText(item)}</Text>
                    {
                        item.file == null ? null : <TouchableOpacity onPress={ () => navigation.navigate('Pdf', {rowFile : index + 1, fileName : ConfigAPI.img_url+'/public/'+ item.file}) }>
                        <Icon color="#517fa4" name="ios-eye" type="ionicon" /> 

                    </TouchableOpacity> 
                    }
                </View>
            </View>
        )
    }

    myBadge = (index, item, navigation) => {
        if (item.allow) {
            return (
                <TouchableOpacity onPress={ () => navigation.navigate('Dokumen', {kode_kelas : this.props.navigation.getParam('kode_kelas'), index : index})} style={{borderWidth : 1, padding : 5, borderColor : 'green', borderRadius : 3}}>
                    <Icon name="upload" type="font-awesome" color={'green'} />
                </TouchableOpacity>
            )
        } else {
            return null
        }
    }

    myTitle = (index, item, navigation) => {
        return (
            <Text style={{fontWeight : 'bold', fontSize : 17, color: '#517fa4'}}>Pertemuan Ke. {index + 1}. Skor: {item.nilai} </Text>
        )
    }

    myListItem = (index, item, navigation) => {
        return (
            <ListItem
                leftIcon = {<Icon name="ios-archive" color="#517fa4" type="ionicon" />}
                title={this.myTitle(index, item, navigation)}
                subtitle={ this.mySubtitle(index, item, navigation) }
                rightElement = {this.myBadge(index, item, navigation)}
                bottomDivider
            />
        )
    }

    render (){
        return (
            <View style={{flex : 1}}>
                {!this.state.isReady ? <ActivityIndicator /> :
                    <FlatList
                        data ={this.props.dataNilaiSiswa.data.akses.data}
                        refreshing = {this.state.isRefresh}
                        onRefresh = {() => this.onRefresh()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({index, item}) => (
                            this.myListItem(index,item, this.props.navigation)
                        )}
                    />
                }
            </View>
        )
    }
}