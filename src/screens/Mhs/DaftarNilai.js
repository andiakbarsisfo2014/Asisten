import React from 'react';

import {Text, View, StatusBar, InteractionManager, ActivityIndicator, TabPanel, Dimensions, FlatList} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, } from 'react-navigation'; 
import {Icon} from 'react-native-elements';
import Absen from './Absen';
import Respon from './Respon';
import Tp from './Tp';
import Tugas from './Tugas';
import Quis from './Quis';
import Laporan from './Laporan';

const Halaman = createAppContainer(

    createStackNavigator (
        {
            Absen : {screen : Absen},
            Respon : {screen : Respon},
            Tp : {screen : Tp},
    
        },
        {
            initialRouteName : 'Tp',
            headerMode : 'none'
        }
    )

)



class Template extends React.PureComponent {
    render () {
        return (
            <View style={{
                flex : 1, 
                flexDirection : 'row', 
                backgroundColor : 'red',
                margin : 10,
                width : (Dimensions.get('window').width / 6), height : 50,
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Icon name={this.props.item.icon} type="font-awesome"  />
            </View>
        )
    }
}

export default class DaftarNilai extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.title,
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    }
    constructor (props) {
        super(props);
        this.state = {
            isRequest : true,
            
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.setState({
                isRequest : false
            });
        })
    }

    componentTab = () => {
        const aj = 'Akbar'
        
    }

    render(){
        return (
            <View style={{flex : 1, flexDirection : 'column',}}>
                <View style={{flex : 1, flexDirection : 'column', justifyContent : 'center'}}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data = {this.state.menu}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({item}) => (
                            <Template item={item} />
                        )}
                    />
                </View>
                <View style={{flex: 6, flexDirection: 'row'}}>
                    <Halaman />
                </View>
            </View>            
        )
    }
}
