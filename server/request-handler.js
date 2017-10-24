
var storage = {};
storage.results = [];

exports.requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

 
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'application/json';

  request.on('error', (err) => {
    console.error(err);
  });


  if (request.url !== '/classes/messages') {  

    response.writeHead(404, headers);
    response.end();

  } else {
    if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(storage));

    } else if (request.method === 'POST') {
      let body = [];

      request.on('data', (chunk) => {
        body.push(chunk);       
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        storage.results.push(JSON.parse(body));
        response.writeHead(201, headers);
        response.end(body);
      });

      response.on('error', (err) => {
        console.error(err);
      });

    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    }
  }


};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
