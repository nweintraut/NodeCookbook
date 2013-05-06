var http = require('http');
var util = require('util');
var WSServer = require('websocket').server;
var url = require('url')
var clientHtml = require('fs').readFileSync('./Ch6Websockets/client.html');
var port = process.env.PORT || 3000;
var plainHttpServer = http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(clientHtml);
}).listen(port, function(){
    console.log("Server launched");    
});

var webSocketServer = new WSServer({httpServer: plainHttpServer});
var accept = ['localhost', '127.0.0.1', 'nodecookbook.nweintraut.c9.io'];
webSocketServer.on('request', function(request){
    console.log("Received request from " + request.origin);
    request.origin = request.origin || '*'; // no origin? Then use * as a wildcard.
    accept.push(url.parse(request.origin).hostname); // plug to force passage
    if(accept.indexOf(url.parse(request.origin).hostname) === -1 ){
        request.reject();
        console.log('disallowed' + request.origin);
        return;
    }
    var websocket = request.accept(null, request.origin);
    websocket.on('message', function(msg){
        console.log('Received "' + msg.utf8Data + '" from ' + request.origin);
        if(msg.utf8Data === 'Hello') {
            websocket.send('WebSockets!');
        }
    });
    websocket.on('close', function(code, desc){
        console.log("Disconnect: ' + code + ' - " + desc);
    });
});