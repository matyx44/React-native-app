import React from 'react';
import { StyleSheet, Text, View,Button,FlatList,StatusBar,RefreshControl,TouchableHighlight } from 'react-native';
import {StackNavigator,} from 'react-navigation';





class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Vítejte!',
    headerStyle: { marginTop: StatusBar.currentHeight },
  };
  render() {
  	 const { navigate } = this.props.navigation;  
    return (
    	<View style={styles.container}>
    		<View style={styles.containerMenu}>
    			<TouchableHighlight
		         style={styles.button}
		         onPress={() =>
		          navigate('Statistics')}
		        >
		         <Text style={styles.menuItem}> Statistiky </Text>
		        </TouchableHighlight>
		        <TouchableHighlight
		         style={styles.button}
		         onPress={() =>
		          navigate('Options')}
		        >
		         <Text style={styles.menuItem}> Možnosti </Text>
		        </TouchableHighlight>
	      </View>
      </View>
    );
  }
}

 class Statistics extends React.Component {

 	static navigationOptions = {
	    title: 'Statistiky',
	    headerStyle: { marginTop: StatusBar.currentHeight },
	  };


	  _onRefresh(){
	  	this.setState({refreshing:true});
	  	this.changeState();
	  }

	constructor() {
		super();
	    this.state = {
	    	temperature: "Loading, please wait!",
	    	date:"",
	    	humidity:"",
	    	refreshing:false,
	    };
	    this.changeState();
  	}

	changeState(){
		getDataFromApi(function(err,data){
	        if (err) {
	                 console.warn(err);     
	        } else {          
	        	var parsed = JSON.parse(data);
	        	var temp = parsed[0]["temperature"];
	        	var date = new Date(parsed[0]["date"]);
	        	var currentTime = new Date();
	        	var difference = Math.floor((currentTime-date) / (1000*60))+60;
	        	var humidity = 100*parsed[0]["humidity"];
	        	var strString = "Teplota "+ temp+"°C";
	        	var humString = "Vlhkost " + Math.floor(humidity)+"%";
	        	var dateString = "Údaje ze serveru jsou staré "+ difference +" minut(y).";
	            this.setState({temperature:strString,date:dateString,humidity:humString,refreshing:false});
	        } 
		}.bind(this));	
	}

	  render() {
	    return (   
	    	
	      <View style={styles.container}>
	         <View style={styles.containerData}>
	         		 <FlatList
	         		 refreshControl={
				          <RefreshControl
				            refreshing={this.state.refreshing}
				            onRefresh={this._onRefresh.bind(this)}
				          />
				        }
			          data={[
			            {key: this.state.temperature },
			            {key: this.state.humidity },
			          ]}
			          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
			        />
		     </View>
		     <View style={styles.containerFooter}>
		        <Text style={{color:'white'}}>{this.state.date}</Text>
	         </View>
	      </View>
	    );
	  }
}

class Options extends React.Component {
  static navigationOptions = {
    title: 'Možnosti',
    headerStyle: { marginTop: StatusBar.currentHeight },
  };
  render() {
  	 const { navigate } = this.props.navigation;  
    return (
      <View style={styles.container}>
      <Text style={styles.item}>Here will be some options</Text>
      </View>
    );
  }
}

const RootNavigator = StackNavigator({
	Home: {screen:HomeScreen},
	Statistics:{screen:Statistics},
	Options:{screen:Options},
});



export default class App extends React.Component {
  render() {
    return <RootNavigator />;
  }
}



function getDataFromApi(callback){		
		let fetchData = { 
		    method: 'GET'		    
		};
	var ipaddr = 'http://147.32.93.73:8080/getCurrentStats'; //ip koleje
	//var ipaddr = 'http://147.32.217.107:8080/getCurrentStats';
	 fetch(ipaddr,fetchData)
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
    backgroundColor: '#3e4444',
  },
  containerMenu:{
  	justifyContent: 'space-between',
  	alignItems:'stretch',
  	flex:0.5,
  	marginTop:100,
  },
  containerData:{
  	justifyContent: 'center',
  	alignItems:'center',
  	flex:0.8,
  },
  containerFooter:{
  	justifyContent: 'flex-end',
  	alignItems:'center',
  	flex:0.1,
  },
  item: {
    fontSize: 30,
    marginTop:30,
    height: 80,
    color:'white',
    fontWeight:'bold',
  },
  button:{
  	alignItems:'center', 
  	backgroundColor: '#4e5555',	
  },
  menuItem: {
    fontSize: 30,
    marginTop:30,
    marginBottom:30,
    color:'white',
    fontWeight:'bold',
  },
});

