var PORT = 9000;

var Chance = require('chance');
var chance = new Chance();
var util = require('util');

var ws = require("ws").Server;
var wss = new ws({port: PORT});

var MongoClient = require('mongodb').MongoClient;

var num_messages = 1000;
var i;

var bad_words = [];
for(var i = 0; i < 100; i++){
	bad_words.push(chance.word());
}
console.log("Bad words: " + util.inspect(bad_words));

function broadcastMessage(msg){
	var reg_ex;
	for(var i = 0, len = bad_words.length; i < len; i++){
		reg_ex = new RegExp(bad_words[i], "ig");
		msg["message"] = msg["message"].replace(reg_ex, "****");
	}
	wss.clients.forEach(function(conn){
		conn.send(JSON.stringify(msg));
	});
}

wss.on('connection', function(conn) {
	conn.on('message', function(str) {
		try{
			broadcastMessage(JSON.parse(str));
		}catch(e){
			console.log("Received bad data.");
		}
	});
});

MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
	if(err) throw err;
	
	var users = db.collection('users');

	users.count(function(err, count){
		function spam(){
			var rand = Math.floor(Math.random() * count);
			users.find({}).skip(rand).limit(num_messages).toArray(function(err, users){
				for(var i = 0, len = users.length; i < len; i++){
					broadcastMessage({"full_name":users[i].full_name,
						"message":chance.sentence({words: 6})});
				}
			});
		}

		setInterval(spam, 5000);
	});
});

console.log("Chat server started on " + PORT + ".");
