import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import PDFView from 'react-native-view-pdf';


const resources = {
	url : 'http://p4tkmatematika.org/file/ARTIKEL/Artikel%20Teknologi/PEMBUATAN%20FILE%20PDF_FNH_tamim.pdf'
};

const resourceType = 'url';

export default class PdfRead extends React.Component {

	static navigationOptions = ({ navigation }) => {
        return {
            headerTitle : () => <Judul judul={'Laporan ke. ' +navigation.state.params.rowFile} />,
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
		this.resources = {
			url : this.props.navigation.state.params.fileName
		}
	}

    render () {
        return (
            <PDFView
         		fadeInDuration={250.0}
          		style={{ flex: 1 }}
          		resource={this.resources.url}
          		resourceType={resourceType}
          		onError={(error) => console.log('Cannot render PDF', error)}
        	/>
        )
    }
}

class Judul extends React.PureComponent {
    render() {
      return (
        <Text style={{fontWeight : 'bold', fontSize : 16, color : '#fff' }}> {this.props.judul} </Text>
      )
    }
  }