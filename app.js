var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/schedule', function(request, response){
    response.send("ok");
});

module.exports = app;