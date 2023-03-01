var http = require('http')
var options = {
    host:'localhost',
    port:'3000',
    path:'/',
    method:'GET'
}
http.createServer(function(require, response) {
    var req = http.request(options, function (res) {
        response.writeHead(200, {
            'Content-Type': 'video/mp4'
        })
        res.pipe(response);
    });
    req.end();
}).listen(5050)