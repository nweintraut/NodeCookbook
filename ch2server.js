// var http    = require('http');
var querystring = require('querystring');
var util = require('util');
var connect = require('connect');
var port = process.env.PORT || 3000;
var form = require('fs').readFileSync('./content/form.html');
var maxData = 2 * 1024 * 1024; // 2mb

// http.createServer(function(request, response){
connect(connect.limit('64kb'), connect.bodyParser(), function(request, response){
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(form);
    } else if(request.method === 'POST') {
          console.log('User posted: \n' + request.body + "\n---");
          response.end("You posted: \n" + util.inspect(request.body) + "\n---");
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});