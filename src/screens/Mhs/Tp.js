import React from 'react';

import {Text, View, FlatList, InteractionManager, ActivityIndicator} from 'react-native';
import { TransitionPresets } from 'react-navigation-stack';
import {ListItem, Icon} from 'react-native-elements';

export default class Absen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : 'Tugas Pendahuluan',
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
                        data ={this.props.dataNilaiSiswa.data.Tp.data}
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