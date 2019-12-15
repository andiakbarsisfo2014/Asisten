import React from 'react';

import {Text, View, Button, StatusBar } from 'react-native';

export default class Praktikum extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Praktikum',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    render(){
        return (
            <View>
                <StatusBar backgroundColor="#004dcf" />
            </View>
        )
    }
}