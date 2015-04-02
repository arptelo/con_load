var mongoose = require("mongoose");

module.exports = function(config){
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback(){
      console.log("Logtimize db opened");
  });
  
  var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String
  });
  
  var User = mongoose.model('User', userSchema);
  User.find({}).exec(function(err, collection){
    if(collection.length === 0){
      User.create({firstName: 'Arslan', lastName: 'Taşkın', userName: 'arslan'});
      User.create({firstName: 'Fatih', lastName: 'Taşkın', userName: 'fatih'});
      User.create({firstName: 'Mustafa', lastName: 'Erbay', userName: 'mustafa'});
    }
  });
};