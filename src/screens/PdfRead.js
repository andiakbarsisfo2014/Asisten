import React, { Component } from 'react';
import { View, StyleSheet,  } from 'react-native';

import { WebView } from 'react-native-webview';


export default class PdfRead extends React.Component {
    render () {
        return (
            <WebView source={{ uri: this.props.navigation.state.params.fileName}} />
        )
    }
}