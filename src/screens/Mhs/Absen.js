import React from 'react';

import {Text, View, FlatList, InteractionManager, ActivityIndicator} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';

export default class Absen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Absen',
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
        }
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
                        data ={this.props.dataNilaiSiswa.data.absen.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = { ({index, item}) => (
                            <ListItem
                                leftIcon = {<Icon name="feed" color="#517fa4" type="font-awesome" />}
                                title={'Pertemuan Ke - ' + (index + 1)}
                                titleStyle={{color : '#517fa4', fontWeight: 'bold'}}
                                subtitle={item[0] == null ? 'Tidak Absen' : item[0] == 1 ? 'Hadir' : 'Absen'}
                                bottomDivider
                            />
                        )}
                    />
                }
            </View>
        )
    }
}