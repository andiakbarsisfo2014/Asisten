import React from 'react';
import {Text, View, StatusBar} from 'react-native';


export default class Profil extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Profil',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    render () {
        return (
            <View>
                <StatusBar backgroundColor="#004dcf" />
                <Text>AA</Text>
            </View>
        )
    }
}