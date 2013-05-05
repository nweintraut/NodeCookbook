var http = require('http');
var url = require('url');
var urlOpts = {host: 'nodecookbook.nweintraut.c9.io', path: '/', port: '80', method: 'POST'};


var request = http.get(urlOpts, function(response){
    response.on('data', function(chunk){
        console.log(chunk.toString());
    }).on('error', function(e){
        console.log('error', e.stack);
    });
});

process.argv.forEach(function(postItem, index){
    if (index > 1)   {request.write(postItem + '\n');} 
});
request.end();
