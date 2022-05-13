var code_file = __filename.replace(__dirname + '/', '');
const package_info = require('./package.json');
var software =
  package_info.name + ' (V ' + package_info.version + ') - ' + code_file;
console.log(software);
console.log('='.repeat(software.length));
console.log();

const debug = require('../debug');
process.chdir(__dirname);

const http = require('http');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(
  cors({
    origin: '*',
  })
);

const test = require('./index.js');

app.use(express.json());

/*
app.get('/:origin', (req, res, next) => {
  if (typeof req.params.origin != 'undefined') {
    switch (req.params.origin) {
      case 'test':
        req.params.url="http://example.org/test.json";
        break;
    }
  }
  test(req, res, next);
});
*/

//app.get('*', test);
app.post('*', (req, res, next) => {
  console.log('Get Post: ', req.body);
  test(req, res, next);
});

const httpServer = http.createServer(app);

httpServer.listen(4001, () => {
  debug.log('HTTP Server running! Port: ' + 4001, package_info.name + '-APP');
});
