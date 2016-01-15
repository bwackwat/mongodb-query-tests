var util = require('util');
var assert = require('assert');

var mongo = require("./db");

mongo(function(db){
	db.command({text:"users", search: "john", limit: 10000000}, function(err, items){
		console.log("Johns: " + util.inspect(items.stats));
		db.close();
	});
});
