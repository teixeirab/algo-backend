'use strict';
const nodemailer = require('nodemailer');
const Promise = require('bluebird')

module.exports = function(Configs) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: Configs.email.host,
    port: Configs.email.port,
    secure: true,
    auth: {
      user: Configs.email.user,
      pass: Configs.email.pass
    }
  });

  this.sendMail = function(mailOptions) {
    const deferred = Promise.pending()
    mailOptions.from = Configs.email.user
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return deferred.reject(error)
      }
      deferred.resolve(info)
    });
    return deferred.promise
  }

  return this
}
