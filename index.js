const package_info = require('./package.json');
var software = package_info.name + ' (V ' + package_info.version + ')';

const http = require('http');
const https = require('https');

async function middelware(req, res, next) {
  /*
    // Needs!
    const cors = require("cors");
    app.use(
      cors({
        origin: '*'
      })
    );
  */

  if (typeof req.body.url != 'undefined') {
    var conn = null;
    if (req.body.url.replace('https://', '') != req.body.url) {
      conn = https;
    } else {
      conn = http;
    }
    await conn
      .get(
        req.body.url,
        {
          headers: {
            'User-Agent': package_info.name + '; ' + req.get('User-Agent'),
          },
        },
        function async(response) {
          response.on('data', async (data) => {
            res.send(data);
          });
        }
      )
      .on('error', function (e) {
        res.send(e);
      });
  } else {
    res.send({ message: 'missing url' });
  }
  //next();
}

module.exports = middelware;
