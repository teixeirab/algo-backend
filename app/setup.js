'use strict';

const express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      morgan = require('morgan');

let app = express();
// app.use(multer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({exposedHeaders: ['x-apikey']}));
app.use(methodOverride());
app.use(morgan('tiny'))

//init container
const depConfigs = require('./depend.json');
const summon = require('summonjs')({configs: depConfigs});
summon.register('DependConfigs', depConfigs)
app.summon = summon
//routes
app.run = function() {
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
  });
};
module.exports = app;
