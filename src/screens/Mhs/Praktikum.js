import React from 'react';

import {Text, View, Button } from 'react-native';

export default class Praktikum extends React.Component {
    render(){
        return (
            <View>
                <Text>Hai fuck</Text>
                <Button title="OPen" onPress={() => this.props.navigation.openDrawer()} /> 
            </View>
        )
    }
}