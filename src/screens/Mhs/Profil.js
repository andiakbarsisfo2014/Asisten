import React from 'react';
import {Text, View, StatusBar, Button} from 'react-native';



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
    coba = () => {
        this.props.navigation.navigate('GambarPage')
    }
    render () {
        return (
            <View>
                <StatusBar backgroundColor="#004dcf" />
                <Text>BB</Text>

                <Button title="Coba" onPress={() => this.coba()} />
            </View>
        )
    }
}