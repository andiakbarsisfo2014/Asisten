import React from 'react';
import {Header, ListItem, Icon} from 'react-native-elements';
import {View, Text, ActivityIndicator, TouchableHighlight} from 'react-native';

export default class DaftarNilai extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            isLoading : true
        }
    }
    componentDidMount () {
        var a = this;
        setTimeout(() => {
            a.setState({isLoading : false})
        }, 1000);
    }
    openMenu = () => {
        this.props.navigation.openDrawer();
    }
    render(){
        if (this.state.isLoading) {
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    <Header
                        centerComponent={{ text: 'Asisten App', style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
                        rightComponent={{ icon: 'search', color: '#fff' }}
                        /> 
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View>
                </View>
            )
        }
        else{
            return(
                <View style={{flex : 1, flexDirection : 'column'}}>
                    <Header
                        leftComponent={<TouchableHighlight underlayColor="grey" onPress={() => this.openMenu()}><Icon name={'bars'}  type='font-awesome' color='#fff' /></TouchableHighlight>}
                        centerComponent={{ text: 'Daftar Nilai', style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
                        rightComponent={{ icon: 'search', color: '#fff' }}
                    />
                </View>
            )
        }
    }
}