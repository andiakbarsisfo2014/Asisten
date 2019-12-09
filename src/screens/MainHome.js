import React, {useState, useEffect} from 'react';
import {View, Text, Animated} from 'react-native';

const FadeIn = (props) => {
	const [fadeIn] = useState(new Animated.Value(0)); 
	React.useEffect( () => {
		Animated.timing(fadeIn, {toValue : 1, duration : 10000}).start();
	}, []);
	return (
		<Animated.View style={{ ...props.style, opacity : fadeIn }}>
			{props.children}
		</Animated.View>
	)
}

export default class MainHome extends React.Component {

	

	render (){
		return (
			<View style={{flex : 1, flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
				<FadeIn style={{width : 220, heigth : 50}}>
					<Text>asas</Text>
				</FadeIn>
			</View>
		)
	}
}