var mongoose = require("mongoose"),
  crypto = require("crypto");

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
    userName: String,
    salt: String,
    hashed_pwd: String,
    roles: [String]
  });
  userSchema.methods = {
    authenticate: function(passwordToMatch){
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
  };
  
  var User = mongoose.model('User', userSchema);
  User.find({}).exec(function(err, collection){
    if(err) console.log(err);
    if(collection.length === 0){
      var salt, hash;
      salt = createSalt();
      hash = hashPwd(salt, 'arslan');
      User.create({firstName: 'Arslan', lastName: 'Taşkın', userName: 'arslan', salt: salt, hashed_pwd: hash, roles: ['admin']});
      salt = createSalt();
      hash = hashPwd(salt, 'fatih');
      User.create({firstName: 'Fatih', lastName: 'Taşkın', userName: 'fatih', salt: salt, hashed_pwd: hash});
      salt = createSalt();
      hash = hashPwd(salt, 'mustafa');
      User.create({firstName: 'Mustafa', lastName: 'Erbay', userName: 'mustafa', salt: salt, hashed_pwd: hash});
    }
  });
};

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest("hex");
}