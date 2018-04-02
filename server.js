//built-in modules
var http = require('http');
var fs = require('fs');
var path = require('path');

//add-on modules
var mime = require('mime');

var cache = {};



//helper functions for serving static HTTP files--------------------------------
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
} //sending 404 errors

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
} //serving file data

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]); //serve file from memory
  } else {
    fs.exists(absPath, (exists) => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            sens404(response);
          } else {
            cache[absPath] = data;
            sendFile(response,absPath,data); //serve file read from disk
          }
        });
      } else {
        send404(response);
      }
    });
  }
} //serving static files



//HTTP server-------------------------------------------------------------------
var server = http.createServer((request, response) => {
  var filePath;

  if(request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' +request.url;
  }
  var absPath = './' +filePath;

  serveStatic(response, cache, absPath);
}); //create HTTP server

server.listen(3000, () => {
  console.log("Server listening on port 3000.")
}); //start HTTP server



//Socket.IO server-------------------------------------------------------------- 
var chatServer = require('./lib/chat_server');
chatServer.listen(server);
