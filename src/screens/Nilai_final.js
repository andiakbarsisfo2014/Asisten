import React from 'react';
import {View, Text, TouchableHighlight, ActivityIndicator} from 'react-native';
import {Icon, Header, ListItem} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';

class NilaiFinal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
        }
    }
    back = () => {
        this.props.history.navigation.navigate('Home');
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
                <Header
                    leftComponent={<TouchableHighlight underlayColor="grey" onPress={() => this.back()}><Icon name={'arrow-left'}  type='font-awesome' color='#fff' /></TouchableHighlight>}
                    centerComponent={{ text: this.props.attribute.nim, style: { color: '#fff', fontSize : 19, fontWeight : 'bold' } }}
                    rightComponent={<TouchableHighlight underlayColor="grey" onPress={() => this.showModal()}><Icon name={'plus-square'}  type='font-awesome' color='#fff' /></TouchableHighlight>}
                />
                {this.state.isLoading ? 
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                        <ActivityIndicator size={35} color="grey" />
                    </View> : 
                    <View>
                        <HeaderNilai attribute={this.props.attribute}/>
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