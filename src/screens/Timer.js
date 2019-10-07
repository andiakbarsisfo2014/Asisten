import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';

const Timer = ({detik}) => {
	console.log(detik);
	return(
		<View style={{flex : 1, justifyContent : 'center' , alignItems : 'center' ,flexDirection : 'row'}}>
			<View style={css.box}>
				<Text style={css.label}>05</Text>
			</View>
			<View style={css.box}>
				<Text style={css.label}>:</Text>
			</View>
			<View style={css.box}>
				<Text style={css.label}>59</Text>
			</View>
		</View>
	)
}

const css = StyleSheet.create({
	box : {
		backgroundColor : 'red', width : 50, height : 50,
		alignItems : 'center', justifyContent : 'center'
	},
	label : {
		fontSize : 25,

	}
});

const mapStateToProps = store => ({
	heartBeat: store.App.detik,
  });

  export default connect(mapStateToProps)(Timer);