var http = require('http');
var url = require('url');
var urlOpts = {host: 'nodecookbook.nweintraut.c9.io', path: '/', port: '80', method: 'POST'};

var result = '';
var request = http.request(urlOpts, function(response){
    response.on('data', function(chunk){
        result = result + chunk.toString() + "\n";
    }).on('error', function(e){
        console.log('error', e.stack);
    }).on('end', function(){
    	console.log (result);
    });
});

process.argv.forEach(function(postItem, index){
    console.log(index + "] [" + postItem + "]");
    if (index > 1)   {request.write(postItem + '\n');} 
});
request.end();
