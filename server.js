
var mysql = require('mysql')
var express = require('express');
var app = express();
var url = require('url');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'windiesel',
  database : 'mydb'
});

function getStats(callback)
{
    connection.query("SELECT date,temperature,humidity FROM statistics", function (err, result, fields) 
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}

app.get('/getStats', function (req, res) {
	console.log('\x1b[1m\x1b[32m%s\x1b[0m', '################################################################');
	console.log("Incoming request to GET data");
    
	  	getStats(function(err,data){
	        if (err) {
	            console.log("ERROR : ",err);            
	        } else {            
	            console.log("Number of results from db : ", data.length);   
	            res.end(JSON.stringify(data));
	        }    
		});		
})

function getCurrentStats(callback){
	connection.query("SELECT date,temperature,humidity FROM statistics ORDER BY date DESC LIMIT 1", function (err, result, fields) 
    {
        if (err) 
            callback(err,null);
        else
            callback(null,result);
    });
}

app.get('/getCurrentStats', function (req, res) {
	console.log('\x1b[1m\x1b[32m%s\x1b[0m', '################################################################');
	console.log("Incoming request to GET data");
    
	  	getCurrentStats(function(err,data){
	        if (err) {
	            console.log("ERROR : ",err);            
	        } else {            
	            console.log("Number of results from db : ", data.length);   
	            res.end(JSON.stringify(data));
	        }    
		});		
})






function setStats(temperature,humidity,date,callback)
{
	var sql = `INSERT INTO statistics (temperature,humidity,date) VALUES('${temperature}','${humidity}','${date}')`;
	console.log(sql);
    connection.query(sql, function (err, result) 
    {
        if (err) 
            callback(err);
        else
            callback(null);
    });
}

app.post('/setStats', function (req, res) {
	console.log('\x1b[1m\x1b[32m%s\x1b[0m', '################################################################');
	var qData = url.parse(req.originalUrl,true).query;
	console.log("Incoming request to SET data");
	setStats(qData.temperature,qData.humidity,qData.date,function(err){
	        if (err) {
	            console.log("ERROR : Insertion failed.");            
	        } else {            
	            console.log("SUCCESS : Data succesfully inserted into database.");   
	            res.end("SUCCESS : Data succesfully inserted into database.");
	        }    
		});

})

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

  	connection.connect(function(err) {
	  if (err) throw err;
	});
})

