var http = require('http');
var fs = require('fs');
var clientHtml = fs.readFileSync('index.html');
var port = process.env.PORT || 3000;

http.createServer(function(request, response){
    response.writeHead(200, {'Content-type': 'text/html'});
    response.end(clientHtml);
}).listen(port, function(){
    console.log("Server launched on port " + port); 
});