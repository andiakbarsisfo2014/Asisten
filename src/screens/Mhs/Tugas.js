import React from 'react';

import {Text, View, FlatList, InteractionManager, ActivityIndicator, AsyncStorage} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import ConfigAPI from '../config/ConfigAPI';

export default class Absen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Nilai Tugas',
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
        super (props);
        this.state = {
            data : [],
            isReady : false,
            isRefresh: false,
        }
    }
    doFecth(kode_kelas){
        AsyncStorage.getItem('attrLogin').then( (value) => {
            let json = JSON.parse(value);
            fetch(ConfigAPI.link + 'get-my-absen', {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization : json.token,
                },
                body : JSON.stringify({
                    kode_kelas : kode_kelas,
                })
            }).then(response => response.json())
            .then( (response) => {
                this.setState({isRefresh : false})
                this.props.dispatch({type : 'setData', data : response.response})
            }).catch( (error) => {
                console.log(error);
                this.setState({
                    isRefresh : false,
                });
                ToastAndroid.show('Terjadi kesalahan', ToastAndroid.SHORT);
            })
        })
    }

    onRefresh() {
        this.setState({isRefresh: true}, () => {this.doFecth(this.props.navigation.state.params.kode_kelas)})
    }
    componentDidMount () {
        InteractionManager.runAfterInteractions( () => {
            this.setState({isReady : true})
        })
    }
    render (){
        return (
            <View style={{flex : 1}}>
                {!this.state.isReady ? <ActivityIndicator /> :
                    <FlatList
                        data ={this.props.dataNilaiSiswa.data.tugas.data}
                        refreshing = {this.state.isRefresh}
                        onRefresh = {() => this.onRefresh()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({index, item}) => (
                            <ListItem
                                leftIcon = {<Icon name="check-circle" color="#004dcf" type="fon-awesome" />}
                                title={'Pertemuan Ke - ' + (index + 1)}
                                badge={{value : item[0], }}
                                bottomDivider
                            />
                        )}
                    />
                }
            </View>
        )
    }
}