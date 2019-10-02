import React from 'react';
import {StyleSheet, Alert, Modal, SafeAreaView, 
    TouchableHighlight, View, Text, 
    PanResponder, Dimensions, Animated, TextInput, ActivityIndicator } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import Laporan from './Laporan';
import Mid from './Mid';
import Nilai_final from './Nilai_final';
const {width} = Dimensions.get('window');

// const TabNavigator = createBottomTabNavigator(
//     {
//         Laporan: { screen: Laporan },
//         Mid: { screen: Mid },
//         Final : {
//             screen : Nilai_final
//         }    
//     },
//     {
//         defaultNavigationOptions : ({ navigation }) => ({
//             tabBarIcon : ({ focused, horizontal, tintColor }) => {
//                 const { routeName } = navigation.state;
//                 if (routeName == 'Laporan') {
//                     return(<Icon
//                         raised
//                         name='sticky-note'
//                         type='font-awesome'
//                         size={19}
//                         color={tintColor}
//                     />)
//                 }
//                 else if (routeName == 'Mid'){
//                     return(<Icon
//                         raised
//                         name='paste'
//                         type='font-awesome'
//                         size={19}
//                         color={tintColor}
//                     />)
//                 }
//                 else{
//                     return(<Icon
//                         raised
//                         name='paperclip'
//                         type='font-awesome'
//                         size={19}
//                         color={tintColor}
//                     />)
//                 }
                
//             }
//         }),
//         tabBarOptions : {
//             labelStyle : {
//                 fontWeight : 'bold',
//                 fontSize : 15
//             }
//         }
        
//     }
// );

// const Container = createAppContainer(TabNavigator);

export default class App extends React.Component {

    constructor (props){
        super(props);
        this.act_new = this.act_new.bind(this);
        this.laporanBaru = this.laporanBaru.bind(this);
        this.state = {
            active : 'laporan',
            modalVisible : false,
            isLoading : true,
            judul_modal : ''
        }
    }

    act_new (param) {
        this.setState({active : param});
    }

    laporanBaru (){
        if (this.state.active == 'laporan') {
            this.setState({judul_modal : 'Laporan'})
        }
        else if (this.state.active == 'mid') {
            this.setState({judul_modal : 'Mid'})
        }
        else{
            this.setState({judul_modal : 'Final'})
        }
        this.setState({modalVisible : true})
    }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column'}}>
                {this.props.navigation.state.params.status == 1 ? <Laporan attribute={this.props.navigation.state.params.passParam} kode_kelas={this.props.navigation.state.params.kode_kelas} history={this.props} /> : null}
                {this.props.navigation.state.params.status == 2 ? <Mid attribute={this.props.navigation.state.params.passParam} kode_kelas={this.props.navigation.state.params.kode_kelas} history={this.props}/> : null}
                {this.props.navigation.state.params.status == 3 ? <Nilai_final attribute={this.props.navigation.state.params.passParam} kode_kelas={this.props.navigation.state.params.kode_kelas} history={this.props}/> : null}
            </View>
        );
    }
}

