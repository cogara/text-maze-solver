var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var maze = require('./routes/maze');

var app = express();

// static files
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', function(req, res) {
    console.log(req.query);
    res.send(":)");
})

// route
app.use('/maze', maze);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
});

// Server Start
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Listening on port', port);
})