var   redis     = require('redis')
    , redisConfig = require('./redis_config')
    , client    = redis.createClient(redisConfig.redisPort, redisConfig.redisHost, {});


client.on('error', function(err){
   console.log("Redis Error: [" + err + "]"); 
});
client.auth(redisConfig.redisAuthentication, function(error, reply){
    if (error) {console.log(">>>>>>>> Redis Authentication Failed: [" + error +"]");}
    else {
        console.log("Redis Authentication Response is: [" + reply + "]");
    process.argv.slice(2).forEach(function(authorChannel, i){
        client.subscribe(authorChannel, function(){
            console.log('Subscribing to ' + authorChannel + ' channel');  
        });
        client.on('message', function(channel, msg){
           console.log("\n%s: %s", channel, msg); 
        });
    });        
    }
});
