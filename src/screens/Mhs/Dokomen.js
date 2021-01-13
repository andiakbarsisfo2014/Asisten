import React from 'react';
import {Header, ListItem, Icon, Avatar, Button, Overlay} from 'react-native-elements';
import {Modal, Dimensions, ToastAndroid, TouchableOpacity, AsyncStorage, Image, View, Text, ActivityIndicator, FlatList, TouchableHighlight, PermissionsAndroid, InteractionManager} from 'react-native';
import koneksi from '../../screens/config/ConfigAPI';
import Asisten from '../../../AsistensService';

export default class Dokumen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Pilih Dokumen',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
    constructor(props) {
        super (props);
        this.state = {
            pdfFile : null,
            doUpload : false,
            fileName : []
        }
    }

    componentDidMount () {
        this.props.navigation.setParams({uploadFile : this.uploadFile})
        InteractionManager.runAfterInteractions(() => {
            this.requestPermission();
        }) 
    }

    uploadFile = () => {
    }

    async requestPermission () {
        
        try {
            const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Asisten.getMyListPdf( (file) => {
                    this.setState({fileName : JSON.parse(file)})
                });
            } else {
                alert('Gagal');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    repartName = (fileName) => {
        var uri = fileName.split('/');
        var fileName = uri[uri.length-1];
        return fileName;
    }

    headFlatList = () => {
        return (
            <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontWeight : 'bold', fontSize : 16}}>Laporan Ke. {this.props.navigation.getParam('index')}</Text>
            </View>
        )
    }

    updateMyReport = (token) => {
        fetch(koneksi.link + 'get-my-absen', {
            method : 'POST',
            headers : {
                Accept : 'application/json',
                'Content-Type' : 'application/json',
                Authorization : token,
            },
            body : JSON.stringify({
                kode_kelas : this.props.navigation.getParam('kode_kelas'),
            })
        }).then(response => response.json())
        .then (response => {
            this.setState({doUpload : false})
            this.props.dispatch({type : 'setData', data : response.response})
            this.props.navigation.goBack(); 
        })
    }

    doUpload = (file) => {
        this.setState({doUpload : true})
        var uri = file.split('/');
        var fileName = uri[uri.length-1];
        var dotFile = fileName.split('.');
        var typeFile = 'application/'+dotFile[dotFile.length-1];
        let body = {
            uri : 'file://'+file,
            name : fileName,
            type : typeFile
        }
        let formData = new FormData();
        formData.append('file', body);
        formData.append('kode_kelas', this.props.navigation.getParam('kode_kelas'));
        formData.append('laporanKe', this.props.navigation.getParam('index'));
        AsyncStorage.getItem('attrLogin').then( (value) => {
            let json = JSON.parse(value);
            fetch(koneksi.link + 'send-my-report', {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    Authorization : json.token,
                },
                body : formData
            }).then(response => response.json())
            .then( (response) => {
                this.updateMyReport(json.token)
            }).catch( (error) => {
                console.log(error);
                this.setState({
                    doUpload : false,
                });
                ToastAndroid.show('Terjadi kesalahan', ToastAndroid.SHORT);
            })
        })   
    }

    render () {
        return (
            <View style={{flex : 1}}>
                <FlatList 
                    ListHeaderComponent = {this.headFlatList()}
                    data ={this.state.fileName.files}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = { ({item, index}) => (
                        <ListItem
                            onPress={() => this.doUpload(item.name)}
                            leftIcon = {<Icon name="file" color="#747474" type="font-awesome" />}
                            title={ this.repartName(item.name)}
                            bottomDivider
                        />
                    )}
                />
                <Overlay
                    isVisible = {this.state.doUpload}
                    onBackdropPress = {() => this.setState({doUpload : false})}
                    width="auto"
                    height="auto"
                >
                    <View style={{height : 40, width : 80, alignItems : 'center'}}>
                        <ActivityIndicator />
                        <Text>Uploading ..</Text>
                    </View>
                </Overlay>
            </View>
        )
    }
}