import React from 'react';
import {Header, ListItem, Icon, Avatar, Button} from 'react-native-elements';
import {Modal, Dimensions, Image, View, Text, ActivityIndicator, FlatList, TouchableHighlight, PermissionsAndroid, InteractionManager} from 'react-native';
import AsistensService from '../../AsistensService';
import ConfigAPI from './config/ConfigAPI';

export default class Gambar extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Gallery',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };

    constructor (props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            img : [],
            showImage : false,
            horizontal : true, 
            numColumns : 2,
            isVisible : false,
            fileName : null,
            isSending : false,
            token : navigation.getParam('token')
        }
    }

    _orientationDidChange(e) {
        // const {width, height} = Dimensions.get('window')
        // if (width > height) {
        //     this.setState({
        //         horizontal : false,
        //     });
        //     console.log('horizontal')
        // }
        // else {
        //     this.setState({
        //         horizontal : true,
        //     });
        //     console.log('vertical');
        // }
    }

    uploadImage = (imageFile) => {
        this.setState({
            isVisible : true,
            fileName : 'file://'+imageFile
        })
    }

    doUploadImage = (imageFile) => {
        this.setState({isSending : true})
        var uri = imageFile.split('/');
        var fileName = uri[uri.length-1];
        var dotFile = fileName.split('.');
        var typeFile = 'image/'+dotFile[dotFile.length-1];
        let bodyForm = {
            uri : imageFile,
            name : fileName,
            type : typeFile,
        }
        var formData = new FormData();
        formData.append('file', bodyForm);
        fetch(ConfigAPI.link+'update-my-profile-mobile', {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Authorization' : this.state.token,
            },
            body : formData,
        }).then(response => response.json())
        .then(response => this.successUpload(response))
        .catch(onRejected => this.errorUpload(onRejected))
    }

    successUpload = (json) => {
        const { state, goBack } = this.props.navigation;
        this.props.dispatch({type : 'fromGallery', data : json.response.data });
        this.setState({isSending : false, isVisible : false});
        goBack();
    }     

    errorUpload = (json) => {
        alert('Terjadi kesalahan upload, silahkan periksa ukuran file anda atau koneksi anda');
        this.setState({isSending : false, isVisible : false});
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.requestPermission();
            
        });
    }
    async requestPermission () {
        try {
            const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                AsistensService.getListImage(
                    (file) => {
                        this.setState({
                            img : JSON.parse(file),
                            showImage : true
                        })
                    }
                )
            } else {
                alert('Gagal');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    render (){
        if (this.state.showImage) {
            return(
                <View>
                    <FlatList 
                        horizontal={false}
                        data = {this.state.img.files}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({item}) => (
                            <ImageGallery uploadImage={this.uploadImage} item={item} />
                        )}
                    />
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.isVisible}
                        onRequestClose={() => { this.setState({isVisible : false})}} >
                        <View style={{backgroundColor : 'rgba(52, 52, 52, 0.7)', justifyContent :'center', alignItems : 'center', flex : 1, flexDirection : 'row'}}>
                            <View style={{backgroundColor : '#fff', height : 300, width : 300, borderRadius : 5}}>
                                <View style={{flex : 1, flexDirection : 'column', padding : 15}}>
                                    <View style={{height : 50, justifyContent : 'center', alignItems : 'center', width : '100%',  borderBottomWidth : 0.5, borderBottomColor : '#464645'}}>
                                        <Text style={{fontWeight : 'bold'}}>Preview Gambar</Text>
                                    </View>
                                    <View style={{ flex : 4, justifyContent : 'center', alignItems : 'center'}}>
                                        <Avatar
                                            rounded
                                            size="xlarge"
                                            source={{uri :this.state.fileName }}
                                        />
                                    </View>
                                    <View style={{flex : 1, height : 50}}>
                                        <Button loading={this.state.isSending} title="Upload" onPress={ () => this.doUploadImage(this.state.fileName)}  />
                                    </View>
                                </View>
                            </View>                            
                        </View>
                    </Modal>
                </View>
            )
        }  
        else{
            return(
                <View>
                    <ActivityIndicator />
                </View>
            )
        }      
    }

    
}

class ImageGallery extends React.PureComponent {
    render () {
        return (
            <TouchableHighlight onPress={()=> this.props.uploadImage(this.props.item.name)} style={{flex : 1,  flexDirection: 'column', }}>
                <Image style={{justifyContent: 'center', alignItems: 'center', height: 100,}} source={{uri : 'file://'+this.props.item.name}} />
            </TouchableHighlight>
        )
    }
}
