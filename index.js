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
    //console.log('Proxy URL: '+req.body.url);
    var newHeaders = JSON.parse(JSON.stringify(req.headers));
    newHeaders['user-agent'] = package_info.name + '; ' + newHeaders['user-agent'];

    var resp_data;
    await conn
      .get(
        req.body.url,
        {
          headers: newHeaders,
        },
        function async(response) {
          response.on('data', async (data) => {
            resp_data += data;
            //res.status(200).send(data);
          });
          response.on('end', () => {
            res.status(200).send(resp_data);
          });
        }
      )
      .on('error', function (e) {
        res.status(500).send(e);
      });
  } else {
    res.status(404).send({ message: 'missing url' });
  }
  //next();
}

module.exports = middelware;
