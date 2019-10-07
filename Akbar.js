
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
} from 'react-native';
import { connect } from 'react-redux';

const Akbar = ({detik}) => {
    console.log(detik);
    return(
        <Text>Akbar</Text>
    )
}

const mapStateToProps = store => ({
    detik: store.App.detik,
  });
  
  export default connect(mapStateToProps)(Akbar);