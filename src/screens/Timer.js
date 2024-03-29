import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager, ActivityIndicator} from 'react-native';
import AsistensService from '../../AsistensService';

AsistensService.startCounter()

class Timer extends React.Component {
    constructor(props) {
      super(props);
		this.warna = "black";
		this.labelPraktikum = "Tidak ada praktikum"; 
      this.state = {
      	time : this.props.count.Minutes + " : "+this.props.count.Seconds,
      	isReady : false,
      	color : 'black',
      };
    }
	componentDidMount() {
        InteractionManager.runAfterInteractions( () => {
			this.setState({isReady : true});
		});
	}
	render(){
		if (this.props.count.Minutes < 2) {
			
			if (this.warna == "black") {
				this.warna = "red";
			} else {
				this.warna = "black";
			}	
		}


		return(
			<View style={{flex : 1, justifyContent : 'center' , alignItems : 'center' ,flexDirection : 'row'}}>
				{
					!this.state.isReady ?
						<ActivityIndicator /> : 
						<View style={{alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontWeight: 'bold', fontSize: 20}}>
								{this.props.count.praktikum}
							</Text>
							<Text>Sisa Waktu : </Text> 
							<Text style={{fontSize: 24, color: this.warna}}>{this.props.count.Minutes + " : "+this.props.count.Seconds}</Text>
						</View>
				}
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