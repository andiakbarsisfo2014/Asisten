import React from 'react';

import {View, Text, Button, StyleSheet, TouchableHighlight} from 'react-native';
import {Header, Icon} from 'react-native-elements'
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class Scanner extends React.Component{
	state = {
		hasCameraPermission: null,
		scanned: false,
	};

  	async componentDidMount() {
    	this.getPermissionsAsync();
  	}

  	getPermissionsAsync = async () => {
    	const { status } = await Permissions.askAsync(Permissions.CAMERA);
    	this.setState({ hasCameraPermission: status === 'granted' });
	};
	  
	openMenu = () => {
		this.props.navigation.openDrawer();
	}

  	render() {
    	const { hasCameraPermission, scanned } = this.state;

    	// if (hasCameraPermission === null) {
      	// 	return <Text>Requesting for camera permission</Text>;
    	// }
    	// if (hasCameraPermission === false) {
      	// 	return <Text>No access to camera</Text>;
    	// }
    	return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
				}}
			>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={[StyleSheet.absoluteFillObject,{flex :1, flexDirection : 'column'}]}
				>
					<View style={[css.bg, {height : 150, alignItems : 'center', justifyContent : 'center'}]}><Text style={{fontSize : 20, color : '#fff', fontWeight : 'bold'}}>Qr-Code</Text></View>
					<View style={{flex : 1, flexDirection : 'row'}}>
						<View style={[{width : 30}, css.bg]}></View>
						<View style={{flex : 1 ,}}></View>
						<View style={[{width : 30}, css.bg]}></View>
					</View>
					<View style={[{height : 150, alignItems : 'center', justifyContent : 'center'}, css.bg]}><Text style={{fontSize : 20, color : '#fff', fontWeight : 'bold'}}>Qr-Code</Text></View>
				</BarCodeScanner>
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}

const css = StyleSheet.create({
	bg : {
		backgroundColor : 'rgba(192,192,192,0.2)'
	}
})