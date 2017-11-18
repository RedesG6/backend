const express = require('express')
const SerialPort = require ('serialport')
const Readline = SerialPort.parsers.Readline
const app = express();
const bodyParser = require('body-parser')
const Debounce = require('./debounce')
const cors = require('cors')

var mysql = require('mysql');

var con = mysql.createPool({
	  connectionLimit: 10,
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "ambiental"
});

app.use(express.static('frontend'))
app.use(cors())
app.use(bodyParser.json())
app.get('/',(req,res) => res.sendFile('frontend/index.html'))

app.post('/data', (req,res) => {
	console.log(req.body)
	con.getConnection((err,connection)=>{
		if (err) throw err
		var sql = "SELECT * FROM capturaAmbiental ORDER BY capturaID DESC LIMIT "+ req.body.quantidade

		con.query(sql,(err,result) => {
			
			let resultFinal = result.reverse()
			res.json(resultFinal)
			connection.release()
		})

	})

})

app.listen(3000,() => console.log('listen'))

var port = new SerialPort('/dev/ttyACM0', {
	  baudRate: 9600
})

let parser = new Readline()
port.pipe(parser)


function complete (data) {
		  	con.getConnection((err,connection)=>{
				if(err) throw err;
				
				var dataobj = JSON.parse(data)
				console.log(dataobj)
				var sql = `INSERT INTO capturaAmbiental(temperatura,luminosidade) values(${dataobj.temperature},${dataobj.luminosity})` 
				
				con.query(sql, (err,result) =>{
				if (err)throw err;

				console.log("1 record inserted");
					connection.release()
				})
				
			})
			
		    };

var deb = new Debounce(complete, 100, (ac, v) => ac + v);

port.on('data', deb.call.bind(deb));
