var http    = require('http');
var querystring = require('querystring');
var util = require('util');
var port = process.env.PORT || 3000;
var form = require('fs').readFileSync('./content/form.html');
var maxData = 2 * 1024 * 1024; // 2mb

http.createServer(function(request, response){
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(form);
    } else if(request.method === 'POST') {
      var postData = '';
      request.on('data', function(chunk){
          postData += chunk;
          if (postData.length > maxData) {
              postData = '';
              this.pause();
              response.writeHead(413); // Request entity too large
              response.end('Too large');
          }
      }).on('end', function() {
          if (!postData) { // prevents empty post requests from crashing the server.
              response.end(); 
              return;
          }
          var postDataObject = querystring.parse(postData);
          console.log('User posted: \n' + postDataObject + "\n---");
          response.end("You posted: \n" + util.inspect(postDataObject) + "\n---");
      });
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});