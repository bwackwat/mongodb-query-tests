var Chance = require('chance');
var chance = new Chance();
var util = require('util');

var mongo = require("./db");

var num_insertions = 10000000;
var i = 0;

var next_name;
var next_user;

mongo(function(db){
	function insert_user(){
		next_name = chance.name();
		next_user = {
			full_name: next_name,
			email: next_name + "@bwackwat.com",
			city: chance.city()
		};

		if(i < num_insertions){
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write("Index: " + i);
			db.users.insert(next_user, function(err, result){
				insert_user();
			});
		}else{
			console.log("Done!");

			db.users.find().limit(5).toArray(function(err, items) {
				console.log("Some: " + util.inspect(items));
				db.close();
			});
		}

		i++;
	}

	db.users.count(function(err, count){
		console.log("Number of users: ", count);
		num_insertions = num_insertions - count;
		console.log("Inserting " + num_insertions + "...");
		insert_user();
	});
});
