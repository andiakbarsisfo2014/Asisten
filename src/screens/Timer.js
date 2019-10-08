import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import AsistensService from '../../AsistensService';

AsistensService.startCounter()

class Timer extends React.Component {

	componentDidMount() {
		console.log(this.props.count);
	}

	render(){
		return(
			<View style={{flex : 1, justifyContent : 'center' , alignItems : 'center' ,flexDirection : 'row'}}>
				<View style={css.box}>
					<Text style={css.label}>{this.props.count.Minutes}</Text>
				</View>
				<View style={css.box}>
					<Text style={css.label}>:</Text>
				</View>
				<View style={css.box}>
					<Text style={css.label}>{this.props.count.Seconds}</Text>
				</View>
			</View>
		)
	}
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

// const mapStateToProps = store => ({
// 	heartBeat: store.App.detik,
//   });

  export default Timer;