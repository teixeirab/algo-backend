'use strict';

const express          = require('express'),
      cors             = require('cors'),
      bodyParser       = require('body-parser'),
      methodOverride   = require('method-override'),
      https            = require('https'),
      fs               = require('fs'),
      morgan           = require('morgan'),
      expressValidator = require('express-validator');

let app = express();
// app.use(multer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors({exposedHeaders: ['x-apikey']}));
app.use(methodOverride());
app.use(morgan('tiny'))

//init container
const depConfigs = require('./depend.json');
const summon = require('summonjs')({configs: depConfigs});
summon.register('DependConfigs', depConfigs)
app.summon = summon
//routes
app.run = function(callback) {
  const targets = Object.keys(depConfigs.dependency).map(function(name) {
    if (name.toLowerCase().indexOf('route') !== -1) {
        return name;
    }
  }).filter(function(name) {
    return name ? true : false;
  });
  summon.invoke({
    override: {
      app: function() {
          return app;
      }
    },
    targets: targets
  });
  const server = app.listen(summon.get('Configs').apiPort || 3000, function() {
    const port = server.address().port;
    console.log('Server up and listening at %s'.green, port);
    callback && callback()
  });
  if (process.env.HTTPS) {
    https.createServer({
      key: fs.readFileSync('./ssl/server-key.pem'),
      cert: fs.readFileSync('./ssl/server-crt.pem'),
      ca: fs.readFileSync('./ssl/ca-crt.pem')
    }, app).listen(8443);
  }
};
module.exports = app;
