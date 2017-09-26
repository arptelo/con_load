var auth = require("./auth");

module.exports = function(app){
  app.get('/partials/*', function(req, res){
      res.render("../../public/app/" + req.params[0]);
  });
  
  app.post('/login', auth.authenticate);
  
  app.post('/logout', function(req, res){
    req.logout();
    res.end();
  });
  
  app.get('/load', function(req, res){
      res.render('load');
  });
  
  app.get('*', function(req, res){
      res.render('index', {
        bootstrappedUser: req.user
      });
  });
  
  //app.get('/schedule', function(req, res){
  //    res.render("schedule.html");
  //});
};