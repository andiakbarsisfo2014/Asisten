import React from 'react';
import {View, Text} from 'react-native';
import {Avatar} from 'react-native-elements';
export default class HeaderNilai extends React.Component {
    render () {
        return (
            <View style={
                {
                    alignItems : 'center', 
                    height : 250, 
                    justifyContent : 'space-around',
                    paddingVertical : 15
                }}
            >
                <Avatar
                  rounded
                  size="xlarge"
                  source={this.props.attribute.avatar_url != undefined ? {uri : this.props.attribute.avatar_url} : require('./logo.png')}
                />
                <View style={{marginTop : 16}}>
                    <Text style={{fontSize : 18, fontWeight : 'bold'}}>{this.props.attribute.name.toUpperCase()}</Text>
                </View>
            </View>
        )
    }
}