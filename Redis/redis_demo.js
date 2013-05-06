var   redis     = require('redis')
    , redisConfig = require('./redis_config')
    , client    = redis.createClient(redisConfig.redisPort, redisConfig.redisHost, {})
    , params    = {author: process.argv[2], quote: process.argv[3]};

client.on('error', function(err){
   console.log("Redis Error: [" + err + "]"); 
});
client.auth(redisConfig.redisAuthentication, function(error, reply){
    if (error) {console.log(">>>>>>>> Redis Authentication Failed: [" + error +"]");}
    else {console.log("Redis Authentication Response is: [" + reply + "]");}
});

client.on('ready', function(){
    if(params.author && params.quote) {
        var randKey = "Quotes:" + (Math.random() * Math.random()).toString(16).replace('.', '');
        client.hmset(randKey, {"author": params.author, "quote": params.quote});
        client.sadd('Author:' + params.author, randKey);
    }
    if(params.author) {
        client.smembers('Author:' + params.author, function(err, keys){
            keys.forEach(function(key){
                client.hgetall(key, function(err, hash){
                    console.log('%s: %s\n', hash.author, hash.quote);
                });
            });
            client.quit();
        });
        return;
    }
});