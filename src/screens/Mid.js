import React from 'react';
import {View, Text, StyleSheet, ToastAndroid, TouchableHighlight, Modal, ScrollView, RefreshControl, ActivityIndicator, AsyncStorage, Dimensions} from 'react-native';
import {Icon, Header, ListItem, Input, Button, Overlay} from 'react-native-elements';
import HeaderNilai from './component/HeaderNilai';
import ConfigAPI from './config/ConfigAPI';
const {width} = Dimensions.get('window');

class Mid extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.atribute.nim,
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerRight: () => (
                <View style={{ flex : 1, alignItems : 'center', flexDirection : 'row', justifyContent : 'space-between'}}>
                    <TouchableHighlight style={css.rightComponent} underlayColor="grey" onPress={() => navigation.getParam('actBtn')()}><Icon name={'plus-square'}  type='font-awesome' color='#fff' /></TouchableHighlight>
                </View>
            )
        };
    };
    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
            showError : false,
            msgErorr : '',
            loadingResult : true,
            nilai : 0,
            subtitle : '',
            isRefreshing : false,
            modalVisible : false,
            isSave : false,
            id_nilai : '',
            value : 0,
            title : 'Input',
            new : true,
            method : null,
        }
    }
    back = () => {
        this.props.history.navigation.navigate('Home');
    }
    componentDidMount (){
        const { navigation } = this.props;
        navigation.setParams({
            actBtn: this.showModal,
        })
        this.prepare()
    }
    prepare = async() => {
        var token;
        await AsyncStorage.getItem('attrLogin').then((v) => {
            var res = JSON.parse(v);
            token = res.token;
            this.getNilai(token);
        })
    }
    getNilai = async(token) => {
        var result = await fetch(ConfigAPI.link+'get-nilai-mid',{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            },
            body : JSON.stringify({
                nim : this.props.navigation.state.params.atribute.nim,
                kode_kelas : this.props.navigation.state.params.atribute.kode_kelas
            })
        })
        var response = await result.json();
        this.reWriteJSON(response);
    }
    reWriteJSON = async(response) => {
        if (response.response != null) {
            this.setState({
                loadingResult : false,
                showError : false,
                isRefreshing : false,
                id_nilai : response.response.id,
                nilai : response.response.nilai_mid,
                subtitle : response.response.created_at,
                value : response.response.nilai_mid,
            });
        }
        else{
            this.setState({
                loadingResult : false,
                showError : true,
                msgErorr : 'Nilai masih kosong',
            });
        }
    }

    onPress = () => {
        this.prepare();
    }
    editNilai = () => {
        this.setState({
            title : 'Update',
            modalVisible : true,
            value : this.state.nilai,
            new : false,
        })
    }
    showModal = () => {
        this.setState({
            title : 'Input',
            modalVisible : true,
            value : 0,
            new : true,
        })
    }

    actSave = async() => {
        this.setState({
            isSave : true,
        })
        var attrLogin = await AsyncStorage.getItem('attrLogin');
        var json = await JSON.parse(attrLogin);
        if (this.state.new) {
            this.formData(ConfigAPI.link+'store-nilai-mid', json.token, null);
        } 
        else {
            this.formData(ConfigAPI.link+'update-nilai-mid/'+this.state.id_nilai, json.token, 'PUT')    
        }
        
    }

    formData = async(url, token, _method) => {
        var result = await fetch(url,{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : token,
            },
            body : JSON.stringify({
                mahasiswa : this.props.attribute.nim,
                kode_kelas : this.props.kode_kelas,
                nilai : this.state.value,
                _method : _method,
            })
        });
        if (result.status == 200) {
            var a = await result.json();            
            if (a.response.success) {
                this.setState({
                    isSave : false,
                    isRefreshing : true,
                    modalVisible : false,
                }, () => this.prepare());
                ToastAndroid.showWithGravityAndOffset(
                    'Data tersimpan', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50
                );
            } else {
                this.setState({
                    isSave : false,
                    modalVisible : false,
                });
                ToastAndroid.showWithGravityAndOffset(
                    a.response.msg[0], ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50
                );
            }
        } else {
            this.setState({
                isSave : false,
                modalVisible : false,
            });
            ToastAndroid.showWithGravityAndOffset(
                'Terjadi kesalahan', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50
            );
        }
    }

    openDelete = () => {
        
    }

    render(){
        return(
            <View style={{flex : 1,  flexDirection : 'column'}}>
                <HeaderNilai attribute={this.props.navigation.state.params.atribute} />
                {this.state.loadingResult ? <ActivityIndicator /> : this.state.showError ? this.error() : 
                    <ScrollView 
                        refreshControl={
                            <RefreshControl colors={['#0E9DDD','#0B7EB1']} refreshing={this.state.isRefreshing} onRefresh={this.onPress} />
                        }
                    >
                        <ListItem
                            onPress = {() => this.editNilai()}
                            onLongPress = {() => this.openDelete()}
                            subtitle = {this.state.subtitle}
                            title="Nilai MID "
                            leftIcon={{ name: 'book' }}
                            badge={{ value: this.state.nilai, textStyle: { color: '#fff' } }}
                            bottomDivider
                            chevron
                        />
                    </ScrollView>
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible : false})
                    }}>
                    <View style={{flex : 1, paddingHorizontal : 10, flexDirection : 'column', justifyContent : 'center', backgroundColor : 'rgba(192,192,192,0.8)' }}>
                        <View style={{height : 50,  backgroundColor : '#fff', borderBottomColor : '#4A5153', borderBottomWidth : 0.4, borderTopStartRadius : 10, borderTopEndRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Text style={{fontSize : 16, fontWeight : 'bold'}}>{this.state.title} Nilai MID</Text>
                        </View>
                        <View style={{height : 150,  backgroundColor : '#fff', borderBottomStartRadius : 10, borderBottomEndRadius : 10}}>
                            <View style={{marginTop : 15}}>
                                <Input
                                    keyboardType={'numeric'}
                                    label = "Nilai MID"
                                    onChangeText={(text) => this.setState({value : text})}
                                    value={String(this.state.value)}
                                />
                            </View>
                            <View style={{marginTop : 15, marginHorizontal : 10}}>
                                <Button
                                    title="Simpan Nilai"
                                    loading={this.state.isSave}
                                    onPress={this.actSave}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    error = () => {
        return(
            <View  style={{flex : 1, alignItems : 'center', }}>
                <View elevation={5} style={{height : 50, width : 250, justifyContent : "center", alignItems : 'center', padding:20,
                    backgroundColor:'#1DA5D1', shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 2, 
                    shadowOffset: {
                        height: 1,
                    width: 1
                    }
                }}>
                    <Text style={{color : '#fff', fontWeight : 'bold'}}>{this.state.msgErorr}</Text>
                </View>
            </View>
        )
    }
}

const css = StyleSheet.create ({
    rightComponent : {
        flex : 1, backgroundColor : '#14489e', borderRadius : 60, marginRight : 10, width : 35, 
        height : 35, justifyContent : 'center' 
    }
})

export default Mid;