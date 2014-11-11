
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var invertedIndex = require('../invertedIndex.js');
var jadeRoot = require('./routes/index');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


invertedIndex.doIndex("../en",function(){
        
        // Routes

//    console.log(invertedIndex.invertedIndex);
    app.get('/', jadeRoot.index);
    app.get('/search', jadeRoot.search(invertedIndex.invertedIndex));

    app.listen(3000, function(){
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
});
