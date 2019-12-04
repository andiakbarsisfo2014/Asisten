import React from 'react';
import {View, Text, TouchableOpacity, InteractionManager, } from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import ConfigAPI from '../config/ConfigAPI';
export default class HeaderNilai extends React.Component {

    showGallery = () => {
        this.props.navigation.navigate('Gambar');
    }

    render () {
        return (
            <View style={{flex : 1, flexDirection : 'column', alignItems : 'center'}}>
                <View style={{ marginTop : 23}}>
                    <Avatar
                    rounded
                    size="xlarge"
                    source={this.props.attribute.avatar_url != undefined ? {uri : ConfigAPI.img_url+'/public'+this.props.attribute.avatar_url} : require('./logo.png')}
                    />
                </View>
                <View style={{bottom : 80, right : 100, justifyContent : 'center', alignItems : 'center', height : 50, width : 50, position : 'absolute'}}>
                    <TouchableOpacity onPress={() => this.showGallery()} style={{ justifyContent : 'center', alignItems : 'center', borderRadius : 60, backgroundColor : '#8C8C8C', height : 40, width : 40 }}>
                        <Icon 
                            name="camera"
                            color="#fff"
                            type='font-awesome'
                        />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop : 16}}>
                    <Text style={{fontSize : 18, fontWeight : 'bold'}}>{this.props.attribute.name.toUpperCase()}</Text>
                </View>
            </View>
        )
    }
}