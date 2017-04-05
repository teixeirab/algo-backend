var request = require('request');
var fs = require('fs')

var options = {
  url: 'https://localhost:8443/api/panel/performance/6',
  headers: {
    'internal-key': '123'
  },
  ca: fs.readFileSync('../ssl/ca-crt.pem')
};

request(options, function(err, response, body) {
  console.log(err, body)
});
