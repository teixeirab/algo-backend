'use strict';

module.exports = function() {
  if (!process.env.NODE_ENV) {
    throw new Error('Environment variable NODE_ENV should be set!')
  }
  let config = require(`./${process.env.NODE_ENV}`)
  return config
}
