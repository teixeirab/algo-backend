'use strict'
const crypto = require('crypto');

module.exports = function() {
  this.hashPassword = function (password) {
    return crypto.createHash('sha1').update(password).digest('hex');
  }
  return this
}
