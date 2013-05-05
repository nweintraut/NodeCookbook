/*
** Demonstrates that could gain access to any file on system. try http://<host>/../insecure_server.js
*/

var http    = require('http'),
    path    = require('path'),
    url     = require('url'),
    fs      = require('fs');
    
var port = process.env.PORT || 3000;
http.createServer(function(request, response){
    var lookup = url.parse(decodeURI(request.url)).pathname;
    lookup = path.normalize(lookup); // path.normalize address the
    // relative directory traversal and poison null byte attacks.
    lookup = (lookup === "/") ? "/index.html" : lookup;
    var f = 'content' + lookup;
    console.log(f);
    fs.readFile(f, function(err, data){
       response.end(data); 
    });
}).listen(port);