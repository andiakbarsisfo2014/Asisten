import React from 'react';

import {View, Text, FlatList, Modal , ActivityIndicator, TouchableHighlight, AsyncStorage} from 'react-native';
import { ListItem, Button,Input, Icon, Header } from 'react-native-elements'
import HeaderNilai from './component/HeaderNilai';

class Laporan extends React.Component {
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
    constructor (props){
        super(props);
        this.editNilai = this.editNilai.bind(this);
        this.state = {
            isLoading : true,
            data : [
                
            ],
            modalVisible : false,
            errorMsg : '',
            showError : false,
        }
    }

    editNilai (param) {
        alert(param)
    }

    componentDidMount(){
        console.log(this.props.navigation.state);
        var a = this;
        setTimeout(function(){
            a.setState({
                isLoading : false,
                data : [
                    {
                        urutan : 1,
                        nilai : 10,
                        judul : 'Pengenalan C++'
                    },
                    {
                        urutan : 2,
                        nilai : 90,
                        judul : 'Input Output'
                    },
                    {
                        urutan : 3, 
                        nilai : 100,
                        judul : 'Seleksi'
                    },
                    {
                        urutan : 4, 
                        nilai : 100,
                        judul : 'Looping'
                    },
                    {
                        urutan : 5, 
                        nilai : 100,
                        judul : 'Array'
                    }
                ]
            })
        }, 700)
    }

    // back(){
    //     this.props.history.navigation.navigate('Home');
    // }

    showModal = () => {
        this.setState({modalVisible : true});
    }

    render(){
        return(
            <View style={{flex : 1, flexDirection : 'column'}}>
                {this.state.isLoading ? <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator size={35} color="grey" />
                </View> : <FlatList 
                    data = {this.state.data}
                    ListHeaderComponent = {<HeaderNilai attribute={this.props.navigation.state.params.atribute} />}
                    showsVerticalScrollIndicator = {false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = {({item}) => (
                        <ListItem
                            onPress = {() => this.editNilai(item.urutan)}
                            key={item.urutan}
                            subtitle = {item.judul}
                            title={'Laporan Ke.' + item.urutan}
                            leftIcon={{ name: 'book' }}
                            badge={{ value: item.nilai, textStyle: { color: '#fff' } }}
                            bottomDivider
                            chevron
                        />
                    )}
                />}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible : false})
                    }}>
                    <View style={{flex : 1, paddingHorizontal : 10, flexDirection : 'column', justifyContent : 'center', backgroundColor : 'rgba(192,192,192,0.8)' }}>
                        <View style={{height : 50,  backgroundColor : '#fff', borderBottomColor : '#4A5153', borderBottomWidth : 0.4, borderTopStartRadius : 10, borderTopEndRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Text style={{fontSize : 16, fontWeight : 'bold'}}>Nilai {this.state.judul_modal}</Text>
                        </View>
                        <View style={{height : 250,  backgroundColor : '#fff', borderBottomStartRadius : 10, borderBottomEndRadius : 10}}>
                            <View style={{marginTop : 15}}>
                                <Input
                                    keyboardType={'numeric'}
                                    label = "Laporan Ke."
                                /> 
                            </View>
                            <View style={{marginTop : 15}}>
                                <Input
                                    keyboardType={'numeric'}
                                    label = "Nilai laporan"
                                />
                            </View>
                            <View style={{marginTop : 15, marginHorizontal : 10}}>
                                <Button
                                    title="Simpan Nilai"
                                    loading
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}


export default Laporan