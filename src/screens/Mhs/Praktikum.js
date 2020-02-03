import React from 'react';

import {Text, View, RefreshControl, ActivityIndicator, FlatList, StatusBar, AsyncStorage, InteractionManager } from 'react-native';
import {ListItem, Button} from 'react-native-elements';
import ConfigAPI from '../config/ConfigAPI';

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

    constructor (props) {
        super(props);
        this.state = {
            isRequest : true,
            isFailed : false,
            dataSource : [],
        }
    }

    componentDidMount () {
        // InteractionManager.runAfterInteractions( () => {
            this.doRequest();
        // });
    }

    doRequest = () => {
        AsyncStorage.getItem('attrLogin').then( (value) => {
            let json = JSON.parse(value);
            fetch(ConfigAPI.link + 'get-my-praktikum-mobile', {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization : json.token,
                }
            }).then(response => response.json())
            .then( (response) => {
                this.setState({
                    isFailed : false,
                    isRequest : false,
                    dataSource : response.data
                })
            }).catch( (error) => {
                console.log(error)
            })
        })
    }

    checkNilai = (kode_kelas, judul) => {
        this.props.navigation.navigate('Nilai',{title : judul, kode_kelas : kode_kelas});
    }

    render(){
        if (this.state.isRequest) {
            return (
                <View style={{flex : 1, flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                    <StatusBar backgroundColor="#004dcf" />
                    <ActivityIndicator color="#004dcf" />
                </View>
            )
        }
        else if (this.state.isFailed) {
            return(
                <View  style={{flex : 1, justifyContent : "center", alignItems : 'center', }}>
                    <StatusBar backgroundColor="#004dcf" />
                    <View elevation={5} style={{height : 150, width : 250, justifyContent : "center", alignItems : 'center', padding:20,
                        backgroundColor:'#d9d9d9', shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 2, 
                        shadowOffset: {
                            height: 1,
                        width: 1
                        }
                    }}>
                        <Text>Terjadi kesalahan</Text>
                        <Button title="Reload" onPress={this.doRequest} />
                    </View>
                </View>
            )
        } 
        else {
            return (
                <View >
                    <StatusBar backgroundColor="#004dcf" />
                    <FlatList
                        data = {this.state.dataSource}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl = {
                            <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRequest} onRefresh={this.doRequest} />
                        }
                        renderItem = { ({item}) => (
                            <ListItem 
                                leftIcon={{name : 'cogs', type : 'font-awesome'}}
                                title={item.judul}
                                subtitle={item.asisten_1.name+' - '+item.asisten_2.name}
                                onPress={() => this.checkNilai(item.id, item.judul)}
                                bottomDivider
                            />
                        )}
                    />

                </View>
            )
        }
    }
}