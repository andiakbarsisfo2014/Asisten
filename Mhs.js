import React from 'react';
import { AsyncStorage , ActivityIndicator, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import { Provider, connect } from 'react-redux';

export default class Mhs extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Asisten's App",
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
    render(){
        return(
            <View>
                <Text>aa</Text>
            </View>
        )
    }
}