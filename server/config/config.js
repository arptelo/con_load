var path = require('path');
var  rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/logtimize',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://arptelo:itu2008@ds045001.mongolab.com:45001/logtimize',
    port: process.env.PORT || 80
  }
};