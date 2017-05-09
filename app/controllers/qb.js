'use strict'
const crypto = require('crypto')
const moment = require('moment')
const async = require('async')
const _ = require('lodash')

module.exports = function(Configs, QuickBookService) {
  const that = this

  this.generateSetUpInvoice = function(req, res) {
    req.checkBody({
      customer_name: {
        notEmpty: true,
        errorMessage: 'Invalid customer_name'
      },
      product_type: {
        matches: {
          options: [/funds|wrappers|loans|hybrids/i]
        },
        errorMessage: 'Invalid product_type'
      },
      series_name: {
        notEmpty: true,
        errorMessage: 'Require series_name'
      }
    })
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.status(403).send({err: result.array()})
      }
      const params = req.body
      QuickBookService.generateSetUpInvoice(params).then((result) => {
        res.send(result)
      }).catch((err) => {
        res.status(403).send(err)
      })
    });
  }

  this.createCustomer = function(req, res) {
    req.checkBody({
      display_name: {notEmpty: true},
      given_name: {notEmpty: true},
      family_name: {notEmpty: true},
      fully_qualified_name: {notEmpty: true},
      company_name: {notEmpty: true},
      email: {
        isEmail: {
          errorMessage: 'Invalid email'
        }
      },
      bill_addr_line_1: {notEmpty: true},
      bill_addr_city: {notEmpty: true},
      bill_addr_country_sub_division_code: {notEmpty: true},
      bill_addr_postal_code: {notEmpty: true},
      print_on_check_name: {notEmpty: true},
      currency_code: {
        isLength: {
          options: [{ min: 3, max: 3 }],
          errorMessage: 'Must be 3 chars long'
        }
      }
    })
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.status(403).send({err: result.array()})
      }
      const params = req.body
      let results = []
      async.eachSeries(['flexfunds', 'ia'], (qbAccountKey, cb) => {
        const qbConfig = Configs.quickbooks[qbAccountKey]
        if (!qbConfig || !qbConfig.account) {
          return cb()
        }
        params.qb_account_key = qbAccountKey
        QuickBookService.createCustomer(params).then((customer) => {
          results.push(customer)
          cb(undefined)
        }).catch(cb)
      }, (err) => {
        if (err) {
          return res.status(403).send(err)
        }
        res.status(200).send(results)
      })
    })
  }

  return this
}
