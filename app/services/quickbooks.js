'use strict'
const async      = require('async')
const _          = require('lodash')
const QuickBooks = require('node-quickbooks')

module.exports = function(app, Configs, QBCustomerModel, QBClassModel, QBItemModel) {
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
    const qbAccount = params.qb_account
    const qbo = this.getQBO(Configs.quickbooks[qbAccount])
    return new Promise((resolve, reject) => {
      qbo.createInvoice(params.invoice, (err, result) => {
        if(err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  this.generateSetUpInvoice = function(params) {
    const customer_name = params.customer_name
    const product_type = params.product_type
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          QBCustomerModel.findOne({display_name: customer_name}).then((customer) => {
            if(!customer) {
              return cb({err: `customer ${customer_name} not found`})
            }
            cb(undefined, customer)
          })
        },
        (customer, cb) => {

        }
      ], (err) => {
        if(err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  this.createCustomer = function(params) {
    const qbAccount = params.qb_account
    const qbo = this.getQBO(Configs.quickbooks[qbAccount])
    let newCustomer = {
      BillAddr: {
        Line1: params.bill_addr_line_1,
        City: params.bill_addr_city,
        CountrySubDivisionCode: params.bill_addr_country_sub_division_code,
        PostalCode: params.bill_addr_postal_code
      },
      GivenName: params.given_name,
      FamilyName: params.family_name,
      FullyQualifiedName: params.fully_qualified_name,
      CompanyName: params.company_name,
      DisplayName: params.display_name,
      PrimaryEmailAddr: {
        Address: params.email
      },
      PrintOnCheckName: params.print_on_check_name,
      CurrencyRef: {
        value: params.currency_code
      }
    }
    return new Promise((resolve, reject) => {
      qbo.createCustomer(newCustomer, (err, result) => {
        if(err) {
          return reject(err)
        }
        QBCustomerModel.create({
          qb_account                         : qbAccount,
          id                                 : result.Id,
          email                              : _.get(result, 'PrimaryEmailAddr.Address'),
          given_name                         : result.GivenName,
          middle_name                        : result.MiddleName,
          family_name                        : result.FamilyName,
          fully_qualified_name               : result.FullyQualifiedName,
          company_name                       : result.CompanyName,
          display_name                       : result.DisplayName,
          print_on_check_name                : result.PrintOnCheckName,
          bill_addr_line1                    : _.get(result, 'BillAddr.Line1'),
          bill_addr_city                     : _.get(result, 'BillAddr.City'),
          bill_addr_country_sub_division_code: _.get(result, 'BillAddr.CountrySubDivisionCode'),
          bill_addr_postal_code              : _.get(result, 'BillAddr.PostalCode'),
          currency_code                      : _.get(result, 'CurrencyRef.value'),
          active                             : result.Active
        }).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  this.createClass = function(params) {
    const qbAccount = params.qb_account
    const seriesNumber = params.series_number
    const qbo = this.getQBO(Configs.quickbooks[qbAccount])
    return new Promise((resolve, reject) => {
      qbo.createClass({
        Name: `Series ${seriesNumber}`
      }, (err, result) => {
        if (err) {
          return reject(err)
        }
        return QBClassModel.create({
          qb_account: qbAccount,
          id: result.Id,
          series_number: seriesNumber,
          name: result.Name,
          fully_qualified_name: result.FullyQualifiedName,
          active: result.Active
        }).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  this.createItem = function(params) {
    const qbAccount = params.qb_account
    const qbo = this.getQBO(Configs.quickbooks[qbAccount])
    return new Promise((resolve, reject) => {
      let item = {
        Name: params.name,
        Type: params.type,
        Description: params.description
      }
      if (params.income_account_id) {
        item.IncomeAccountRef = {
          value: params.income_account_id
        }
      }
      if (params.expense_account_id) {
        item.ExpenseAccountRef = {
          value: params.expense_account_id
        }
      }
      if (params.asset_account_id) {
        item.AssetAccountRef = {
          value: params.asset_account_id
        }
      }

      qbo.createItem(item, (err, result) => {
        if (err) {
          return reject(err)
        }
        return QBItemModel.create({
          qb_account: qbAccount,
          id: result.Id,
          name: result.Name,
          description: result.Description,
          type: result.Type,
          income_account_id: _.get(result, 'IncomeAccountRef.value'),
          expense_account_id: _.get(result, 'ExpenseAccountRef.value'),
          asset_account_id: _.get(result, 'AssetAccountRef.value'),
          active: result.Active
        }).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  return this
}
