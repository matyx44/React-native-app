import React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';

export default class App extends React.Component {
		

	constructor() {
		super()
	    this.state = {mes: "Loading, please wait!"} 
	    this.changeState()
  	}

	changeState(){
		getDataFromApi(function(err,data){
	        if (err) {
	                 console.warn(err);     
	        } else {          
	            this.setState({mes:data});
	        } 
		}.bind(this));	
	}

  render() {
    return (   
      <View style={styles.container}>
        <Text>Hello!</Text>
        <Text>{this.state.mes}</Text>      
      </View>
    );
  }
}

function getDataFromApi(callback){		
		let fetchData = { 
		    method: 'GET'		    
		};

	 fetch('http://147.32.93.73:8080/getStats',fetchData)
      .then((response) => response.json())
      .then((responseJson) => {
        callback(null,JSON.stringify(responseJson))
      })
      .catch((error) => {
        callback(error,null)
      });
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
