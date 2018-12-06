
/**
 * Created and commented by Alexis Apablaza
 * aapablaza@ug.uchile.cl
 *
 * This little program is an "OK_Server", this is, it recieves HTPPS calls and
 * response with a HTTP 200 Status.
 * It works with built in NodeJS modules HTTPS, FS and PATH.
 *
 * This server requieres a KEY.pem and CERTIFICATE.pem certificates. Create your
 * own with OpenSSL (https://www.openssl.org/).
 */

/* eslint-disable no-console */

// PORT
const port = 8080; // CHANGE THE LISTEN PORT IF NEEDED

// MODULE IMPORTS
const https = require('https');
const path = require('path');
const fs = require('fs');

// HttpsAggent Options
const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')), // Create with OpenSSL
  cert: fs.readFileSync(path.join(__dirname, 'certificate.pem')), // Create with OpenSSL
  rejectUnauthorized: false,
  requestCert: false,
};

// HTTPS Server and Logic
const server = https.createServer(options, (req, res) => {
  const { headers } = req;
  let body = [];

  // Printing to console the incomming Request Headers
  console.log('::REQUEST::');
  console.log('Headers:', headers);

  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // Printing to console the incomming Data Body
    console.log('Data:', body);
  });

  // Header and HTTP 200 OK status
  res.writeHead(200, { 'Content-Type': 'application/json' });

  // For sending BODY
  res.write(JSON.stringify(body)); // Sends back the same BODY (data) recieved

  // Ends the response and sends it
  res.end();

  // Notifies the user that a response has been dispatched
  console.log('::RESPONSE::', res.statusCode);
});

// If there is an error, the server will dispatch a HTTP 500 error
server.on('Error', (err, socket) => {
  socket.end('HTTP/1.1 500 Internal Server Error\r\n\r\n');
});

// START LISTENING ON PORT
server.listen(port);

// STARTED
console.log('***************************************************************************************');
console.log(`***************** OK_Server initiated on port ${port} (ok_server.js) *****************`);
