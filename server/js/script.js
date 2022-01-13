function getTrans(){
var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'api.xendit.co',
  'path': '/reports',
  'headers': {
    'Authorization': 'Basic eG5kX2RldmVsb3BtZW50X3RwTWF6MWgxbkxwbnNrRXpkSXV3VDRrdVdBNjB3NGs3bmdaZFB6cE9rNXRJTjFsMmZYMXl4b3RGWXJjeGs6',
    'Content-Type': 'application/json',
    'Cookie': 'incap_ses_570_2182539=oxdbSeG1+lPdokx9GwzpB+8h1GEAAAAAK5+07nzknUXLQMC3B4n5gg==; nlbi_2182539=NrVoRe3Doz3PcG5ZjjCKbQAAAAAYq4YdfM2lDpO1xI8THcf0'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = JSON.stringify({
  "type": "TRANSACTIONS",
  "filter": {
    "from": "2021-09-23T04:01:55.574Z",
    "to": "2021-11-24T04:01:55.574Z"
  },
  "format": "CSV",
  "currency": "PHP"
});

req.write(postData);

req.end();
}