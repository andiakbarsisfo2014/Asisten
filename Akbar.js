
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
} from 'react-native';
import { connect } from 'react-redux';
import AsistensService from './AsistensService';

class Akbar extends React.Component {
  render(){
    return(
      <Text>{this.props.value}</Text>
    )
  }

  componentDidMount () {
    AsistensService.startCounter();
  }
}

// const mapStateToProps = store => ({
//     detik: store.App.detik,
//   });
  
  export default Akbar;