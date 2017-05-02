'use strict'
const async = require('async')
const QuickBooks = require('node-quickbooks')

module.exports = function(app, Configs) {
  this.getQBO = (config) => {
    return new QuickBooks(
      config.consumerKey,
      config.consumerSecret,
      config.token,
      config.tokenSecret,
      config.realmId,
      config.useSandbox,
      config.debug
    )
  }

  this.createInvoice = function(params) {
    const qbo = this.getQBO(Configs.quickbooks.flexfunds)
    return new Promise((resolve, reject) => {
      qbo.createInvoice(params, (err, result) => {
        if(err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  return this
}
