'use strict'
const crypto = require('crypto')
const moment = require('moment')
const async = require('async')
const _ = require('lodash')

module.exports = function(Configs, QuickBookService, SqlService) {
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

  this.generateLegalInvoice = function(req, res) {
    req.checkBody({
      customer_name: {
        notEmpty: true,
        errorMessage: 'Invalid customer_name'
      },
      type: {
        matches: {
          options: [/Amendment: EUR 3500|Amendment: EUR 7000|Tranche: EUR 500|Pre-Issuance Amendment: EUR 1000|Pre-Issuance Amendment: EUR 500/i]
        },
        errorMessage: 'Invalid type'
      },
      series_number: {
        notEmpty: true,
        errorMessage: 'Require series_number'
      }
    })
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.status(403).send({err: result.array()})
      }
      const params = req.body
      QuickBookService.generateLegalInvoice(params).then((result) => {
        res.send(result)
      }).catch((err) => {
        res.status(403).send(err)
      })
    });
  }

  this.generateMaintenanceInvoice = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    req.checkBody({
      from: {
        notEmpty: true,
        errorMessage: 'Invalid from'
      },
      to: {
        notEmpty: true,
        errorMessage: 'Invalid to'
      }
    })
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.status(403).send({err: result.array()})
      }
      let params = {
        series_number: seriesNumber,
        from: moment(req.body.from).toDate(),
        to: moment(req.body.to).toDate()
      }
      QuickBookService.createMaintenanceInvoice(params).then((result) => {
        res.send(result)
      }).catch((err) => {
        console.log(err)
        res.status(403).send(err)
      })
    })
  }

  this.generateInterestInvoice = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    SqlService.viewData('current_interest', `where a.series_number=${seriesNumber}`).then((results) => {
      if(!results || !results.length) {
        return res.status(403).send()
      }
      let interestData = results[0]
      Object.keys(req.body).forEach((key) => {
        let validParam = [
          'Nominal Basis',
          'Interest Rate',
          'Interest Repayment',
          'Interest Income',
          'Principal Repayment',
          'Cash Round Up'
        ].indexOf(key) >= 0
        if(!validParam) {
          return
        }
        interestData[key] = req.body[key]
      })
      QuickBookService.createInterestInvoice(interestData).then(() => {
        res.status(200).send()
      }).catch((err) => {
        res.status(403).send(err)
      })
    })
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
