import React from 'react';
import {View, Text, TouchableHighlight, ActivityIndicator} from 'react-native';
import {Icon, Header, ListItem} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';

class NilaiFinal extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.atribute.nim,
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
        }
    }
    componentDidMount (){
        var that = this;
        setTimeout(() => {
            that.setState({isLoading : false})
        }, 1000);
        
    }
    render(){
        return(
            <View style={{flex : 1,  flexDirection : 'column'}}>
                {this.state.isLoading ? 
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View> : 
                    <View>
                        <HeaderNilai attribute={this.props.navigation.state.params.atribute} />
                        <ListItem
                            // onPress = {() => this.editNilai(item.urutan)}
                            subtitle = {'useless'}
                            title={'Laporan Ke.' + 1}
                            leftIcon={{ name: 'book' }}
                            badge={{ value: 100, textStyle: { color: '#fff' } }}
                            bottomDivider
                            chevron
                        />
                    </View>
                }
            </View>
        )
    }
}

export default NilaiFinal;