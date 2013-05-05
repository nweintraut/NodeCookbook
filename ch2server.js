var http    = require('http');
var port = process.env.PORT || 3000;
var form = require('fs').readFileSync('./content/form.html');

http.createServer(function(request, response){
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(form);
    } else if(request.method === 'POST') {
      var postData = '';
      request.on('data', function(chunk){
          postData += chunk;
      }).on('end', function() {
          console.log('User posted: \n' + postData + "\n---");
          response.end("You posted: \n" + postData + "\n---");
      });
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});