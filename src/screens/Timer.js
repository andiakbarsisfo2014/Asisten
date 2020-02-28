import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, Text, StyleSheet, InteractionManager, ActivityIndicator} from 'react-native';
import AsistensService from '../../AsistensService';

AsistensService.startCounter()

class Timer extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const { state: { params = {} } } = navigation;
        return {
            title : navigation.getParam('praktikum'),
            headerStyle: {
                backgroundColor: '#004dcf',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    constructor(props) {
      super(props);
		this.warna = "black";
      this.state = {
      	time : this.props.count.Minutes + " : "+this.props.count.Seconds,
      	isReady : false,
      	color : 'black',
      };
    }
	componentDidMount() {
        InteractionManager.runAfterInteractions( () => {
        	this.setState({isReady : true});
        // 	var that = this;
        // 	var duration = 60 * 5;
		// 	var timer = duration, minutes, seconds;
        // 	var time = setInterval(function () {
		//         minutes = parseInt(timer / 60, 10);
		//         seconds = parseInt(timer % 60, 10);

		//         that.setState({
		//         	time : minutes + ":" + seconds,
		//         	color: minutes < 2 ? 'red' : 'black',
		//         })
		//         if (minutes < 1 && seconds < 1) {
		//             clearInterval(time);
		//             console.log("bangke")
		//             // timer = duration;
		//         }
		//         if (--timer < 0) {
		//         	timer = duration;
		//         }
	   	// 	}, 1000);
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