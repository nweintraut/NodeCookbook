var http = require('http');
var util = require('util');

var clientHtml = require('fs').readFileSync('./Ch6Websockets/sioclient.html');
var port = process.env.PORT || 3000;
var plainHttpServer = http.createServer(function(request, response){
    response.writeHead(200, {'Content-type': 'text/html'});
    response.end(clientHtml);
}).listen(port, function(){
    console.log("Server launched");    
});

var io = require('socket.io').listen(plainHttpServer);
// io.set('origins', ['localhost', '127.0.0.1:3000', 'c9.io/']);
io.sockets.on('connection', function(socket){
    socket.emit('ready');
   socket.on('message', function(msg){
       if (msg === 'Hello') {
           socket.send('socket.io!');
       }
   }); 
});