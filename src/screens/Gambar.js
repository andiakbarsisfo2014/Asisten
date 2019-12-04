import React from 'react';
import {Header, ListItem, Icon} from 'react-native-elements';
import {Image, View, Text, ActivityIndicator, FlatList, TouchableHighlight, PermissionsAndroid, InteractionManager} from 'react-native';
import AsistensService from '../../AsistensService';

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
        this.state = {
            img : [],
            showImage : false,
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.requestPermission()
        })
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
                            <ImageGallery item={item} />
                        )}
                    />
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
            <View style={{flex : 1,  flexDirection: 'column', }}>
                <Image style={{justifyContent: 'center', alignItems: 'center', height: 100,}} source={{uri : 'file://'+this.props.item.name}} />
            </View>
        )
    }
}
