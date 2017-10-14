
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
	console.log("he wants to GET");
    
	  	getStats(function(err,data){
	        if (err) {
	            console.log("ERROR : ",err);            
	        } else {            
	            console.log("result from db is : ",data[0], data.length);   
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
	var qData = url.parse(req.originalUrl,true).query;
	console.log(`he wants to SET, date: ${qData.date}`);
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

