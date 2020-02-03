import React from 'react';

import {Text, View, StatusBar, InteractionManager, ActivityIndicator, TabPanel, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator, createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';
import Absen from './Absen';
import Respon from './Respon';
import Tp from './Tp';
import Tugas from './Tugas';
import Quis from './Quis';
import Laporan from './Laporan';
import { createAppContainer } from 'react-navigation';


// const Nilai = createMaterialTopTabNavigator (
//     {
//         Absen : {
//             screen : Absen,
//         },
//         Respon : {screen : Respon},
//         'T-P' : {screen : Tp},
//         Quis : {screen : Quis},
//         Tugas : {screen : Tugas},
//         Laporan : {screen : Laporan}
//     },
//     {
//         initialRouteName : 'Absen',
//         lazy : true,
//         tabBarOptions: {
            
//             scrollEnabled: true,
//             activeTintColor: '#e91e63',
//             activeTintColor : '#004dcf',
//             inactiveTintColor : '#464646',
//             style : {
//                 backgroundColor : '#fff'
//             },
//             labelStyle: {
//                 fontSize: 14,
//                 fontWeight : 'bold'
//             },
//             tabStyle : {
//                 width : 100,
//             }
//         }
//     }
// );


// const Container = createAppContainer(Nilai)

const FirstRoute = () => (
    <View style={{ backgroundColor: '#ff4081', flex : 1 }} />
  );
  const SecondRoute = () => (
    <View style={{flex : 1, backgroundColor: '#673ab7' }} />
  );

export default class DaftarNilai extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Nilai ',
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            isLoading : true,
            index: 0,
            routes : [
                { key: 'first', title: 'First' },
                { key: 'second', title: 'Second' },
                { key: 'tiga', title: 'Tiga'}
            ]
        }
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions( () => {
        //     this.setState({isLoading : false})
        // })
        this._navListener = this.props.navigation.addListener('didFocus', (payload) => {
            this.setState({isLoading : false})
        });
    }

  

    render (){
        if (this.state.isLoading) {
            return (
                <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator />
                </View>
            )
        }
        else{
            return (
               <TabView 
                    navigationState={this.state}
                    renderScene={
                        SceneMap({
                            first: FirstRoute,
                            second: SecondRoute,
                            tiga : FirstRoute,
                            // empat : SecondRoute,
                            // lima : FirstRoute,
                            // enam : SecondRoute
                        })
                    }
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
               />
            )
        }
    }
}
