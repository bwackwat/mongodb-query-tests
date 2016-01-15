var MongoClient = require('mongodb').MongoClient;

//SETUP NOTES:
//mongod --setParameter textSearchEnabled=true
//db.createCollection("users", {})
//setParameter=textSearchEnabled=true
//db.users.ensureIndex({full_name: "text"})

module.exports = function(callback){
	MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db){
		if(err) throw err;

		db.command({'setParameter': 1, "textSearchEnabled": true})

		db.users = db.collection('users');

		db.users.ensureIndex({full_name: 'text'}, function(err, result){
			if(err) throw err;

			callback(db);
		});
	});
};
