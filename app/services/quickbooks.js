'use strict'
const async      = require('async')
const _          = require('lodash')
const moment     = require('moment')
const QuickBooks = require('node-quickbooks')

module.exports = function(
  app,
  Configs,
  QBCustomerModel,
  QBClassModel,
  QBItemModel,
  QBInvoiceTypeItemModel,
  QBInvoiceModel) {

  const that = this

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

  this.calcExchangeRate = function(qb_account_key, fromCcy, toCcy) {
    const qbConfig = Configs.quickbooks[qb_account_key]
    const qbo = this.getQBO(qbConfig)
    return new Promise((resolve, reject) => {
      const twoWeekAgo = moment().subtract(2, 'weeks').format('YYYY-MM-DD')
      qbo.findExchangeRates(
        `where sourcecurrencycode in ('${fromCcy}', '${toCcy}') and asofdate>'${twoWeekAgo}'`,
        (err, rateData) => {
          if (err || !_.get(rateData, 'QueryResponse.ExchangeRate')) {
            return reject(err || {err: 'exchange rate not found'})
          }
          let rates = rateData.QueryResponse.ExchangeRate
          let sourceRates = _.remove(rates, (rate) => {
            return rate.SourceCurrencyCode === fromCcy
          })
          sourceRates.sort((a, b) => {
            return new Date(b.AsOfDate) - new Date(a.AsOfDate)
          })
          rates.sort((a, b) => {
            return new Date(b.AsOfDate) - new Date(a.AsOfDate)
          })
          let latestSourceRate = sourceRates[0]
          let latestTargetRate = _.find(rates, (rate) => {
            return latestSourceRate.AsOfDate === rate.AsOfDate
          })
          let exchangeRate = latestSourceRate.Rate / latestTargetRate.Rate
          resolve(exchangeRate)
        }
      )
    })
  }

  this.createInvoice = function(params) {
    const qbAccountKey = params.qb_account_key
    const qbConfig = Configs.quickbooks[qbAccountKey]
    const fromCurrency = params.from_currency
    const toCurrency = _.get(params, 'invoice.CurrencyRef.value')
    const qbo = this.getQBO(qbConfig)
    return new Promise((resolve, reject) => {
      that.calcExchangeRate(qbAccountKey, fromCurrency, toCurrency).then((rate) => {
        params.invoice.Line.forEach((line) => {
          line.Amount *= rate
        })
        qbo.createInvoice(params.invoice, (err, result) => {
          if(err) {
            return reject(err)
          }
          QBInvoiceModel.create({
            id              : result.Id,
            qb_account      : qbConfig.account,
            customer_id     : _.get(result, 'CustomerRef.value'),
            doc_num         : result.DocNumber || result.Id,
            total_amount    : result.TotalAmt,
            currency_code   : _.get(result, 'CurrencyRef.value'),
            exchange_rate   : result.ExchangeRate,
            due_date        : result.DueDate,
            txn_date        : result.TxnDate,
            email_status    : result.EmailStatus,
            einvoice_status : result.EInvoiceStatus,
            balance         : result.Balance
          }).then((invoice) => {
            qbo.sendInvoicePdf(result.Id, (err, result) => {
              if (err) {
                return reject(err)
              }
              invoice.email_status = result.EmailStatus
              invoice.save().then(() => {
                resolve(result)
              })
            })
          }).catch((err) => {
            reject(err)
          })
        })
      })
    })
  }

  this.generateLegalInvoice = function(params){
    const customer_name = params.customer_name;
    const series_number = params.series_number;
    const product_type = params.product_type.toUpperCase();
    const qbAccountKey = 'flexfunds';
    const qbConfig = Configs.quickbooks[qbAccountKey];
    const className = 'Series';
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          QBCustomerModel.findOne({
            where: {
              qb_account: qbConfig.account,
              display_name: customer_name
            }
          }).then((customer) => {
            if(!customer) {
              return cb({err: `customer ${customer_name} not found`})
            }
            cb(undefined, customer)
          })
        },
        (customer, cb) => {
          QBClassModel.findOne({
            where: {
              fully_qualified_name: className
            }
          }).then((cls) => {
            if(!cls) {
              return cb({err: `invalid product type ${product_type}`})
            }
            cb(undefined, customer, cls)
          })
        },
        (customer, cls, cb) => {
          QBInvoiceTypeItemModel.findAll({
            where: {
              invoice_type: product_type
            }
          }).then((items) => {
            if (!items.length) {
              return cb({err: `no items found for product type ${product_type}`})
            }
            async.eachSeries(items, (item, _cb) => {
              QBItemModel.findOne({
                where: {
                  id: item.item_id
                }
              }).then((_item) => {
                if (!_item) {
                  return _cb()
                }
                item.description = _item.description
                _cb()
              })
            }, () => {
              let lines = items.map((item) => {
                return {
                  Amount: item.item_amount,
                  DetailType: "SalesItemLineDetail",
                  Description: item.description,
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: item.item_id
                    },
                    ClassRef: {
                      value: cls.id
                    },
                    Qty: 1
                  }
                }
              })
              lines.unshift({
                DetailType: 'DescriptionOnly',
                Description: `Setup Fees for FlexETP ${cls.name} - ${series_name}`
              })
              let invoice = {
                Line: lines,
                CustomerRef: {
                  value: customer.id
                },
                //when this field is null, it defaults to customer's currency_code
                //but when it is different from customer's currency_code it throws error:
                //====Business Validation Error: The currency of the transaction is invalid for customer/vendor/account.====
                //so setting this field seems not necessary so far.
                CurrencyRef: {
                  value: customer.currency_code
                },
                BillEmail: {
                  Address: customer.email
                },
                EmailStatus: 'NeedToSend',
                CustomerMemo: {
                  value: "Make checks payable in USD to: \n " +
                  "Bank: Bank of America \n" +
                  "Account Name: FlexFunds ETP LLC \n" +
                  "Account Number: 898067231257 \n" +
                  "Routing (wires): 026009593 SWIFT: BOFAUS3N \n" +
                  "(for all other currencies, please use BOFAUS6S) \n" +
                  "Address: 495 Brickell Avenue. Miami, FL 33131 \n" +
                  "\n" +
                  "If you have any questions concerning this invoice, \n" +
                  "contact us at accounting@flexfundsetp.com"
                }
                // DocNumber: null
              }
              cb(undefined, invoice, items[0].item_currency)
            })
          })
        },
        (invoice, currency_code, cb) => {
          that.createInvoice({
            qb_account_key: qbAccountKey,
            invoice: invoice,
            from_currency: currency_code
          }).then((result) => {
            cb(undefined, result)
          }).catch((err) => {
            cb(err)
          })
        }
      ], (err, result) => {
        if(err) {
          return reject(err)
        }
        resolve(result)
      })
    })

  }

  this.generateSetUpInvoice = function(params) {
    const customer_name = params.customer_name
    const product_type = params.product_type.toUpperCase()
    const series_name = params.series_name
    const qbAccountKey = 'flexfunds'
    const qbConfig = Configs.quickbooks[qbAccountKey]
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          QBCustomerModel.findOne({
            where: {
              qb_account: qbConfig.account,
              display_name: customer_name
            }
          }).then((customer) => {
            if(!customer) {
              return cb({err: `customer ${customer_name} not found`})
            }
            cb(undefined, customer)
          })
        },
        (customer, cb) => {
          const classMaps = {
            FUNDS: 'Fund',
            WRAPPERS: 'Wrapper',
            LOANS: 'Loan',
            HYBRIDS: 'Hybrid'
          }
          const className = classMaps[product_type]
          if (!className) {
            return cb({err: `invalid product type ${product_type}`})
          }
          QBClassModel.findOne({
            where: {
              fully_qualified_name: className
            }
          }).then((cls) => {
            if(!cls) {
              return cb({err: `invalid product type ${product_type}`})
            }
            cb(undefined, customer, cls)
          })
        },
        (customer, cls, cb) => {
          QBInvoiceTypeItemModel.findAll({
            where: {
              invoice_type: product_type
            }
          }).then((items) => {
            if (!items.length) {
              return cb({err: `no items found for product type ${product_type}`})
            }
            async.eachSeries(items, (item, _cb) => {
              QBItemModel.findOne({
                where: {
                  id: item.item_id
                }
              }).then((_item) => {
                if (!_item) {
                  return _cb()
                }
                item.description = _item.description
                _cb()
              })
            }, () => {
              let lines = items.map((item) => {
                return {
                  Amount: item.item_amount,
                  DetailType: "SalesItemLineDetail",
                  Description: item.description,
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: item.item_id
                    },
                    ClassRef: {
                      value: cls.id
                    },
                    Qty: 1
                  }
                }
              })
              lines.unshift({
                DetailType: 'DescriptionOnly',
                Description: `Setup Fees for FlexETP ${cls.name} - ${series_name}`
              })
              let invoice = {
                Line: lines,
                CustomerRef: {
                  value: customer.id
                },
                //when this field is null, it defaults to customer's currency_code
                //but when it is different from customer's currency_code it throws error:
                //====Business Validation Error: The currency of the transaction is invalid for customer/vendor/account.====
                //so setting this field seems not necessary so far.
                CurrencyRef: {
                  value: customer.currency_code
                },
                BillEmail: {
                  Address: customer.email
                },
                EmailStatus: 'NeedToSend',
                CustomerMemo: {
                  value: "Make checks payable in USD to: \n " +
                          "Bank: Bank of America \n" +
                          "Account Name: FlexFunds ETP LLC \n" +
                          "Account Number: 898067231257 \n" +
                          "Routing (wires): 026009593 SWIFT: BOFAUS3N \n" +
                          "(for all other currencies, please use BOFAUS6S) \n" +
                          "Address: 495 Brickell Avenue. Miami, FL 33131 \n" +
                          "\n" +
                          "If you have any questions concerning this invoice, \n" +
                          "contact us at accounting@flexfundsetp.com"
                }
                // DocNumber: null
              }
              cb(undefined, invoice, items[0].item_currency)
            })
          })
        },
        (invoice, currency_code, cb) => {
          that.createInvoice({
            qb_account_key: qbAccountKey,
            invoice: invoice,
            from_currency: currency_code
          }).then((result) => {
            cb(undefined, result)
          }).catch((err) => {
            cb(err)
          })
        }
      ], (err, result) => {
        if(err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  this.createCustomer = function(params) {
    const qbAccountKey = params.qb_account_key
    const qbConfig = Configs.quickbooks[qbAccountKey]
    const qbo = this.getQBO(qbConfig)
    let newCustomer = {
      GivenName: params.given_name,
      FamilyName: params.family_name,
      FullyQualifiedName: params.fully_qualified_name,
      DisplayName: params.display_name,
      CompanyName: params.company_name,
      PrimaryEmailAddr: {
        Address: params.email
      },
      BillAddr: {
        Line1: params.bill_addr_line_1,
        City: params.bill_addr_city,
        CountrySubDivisionCode: params.bill_addr_country_sub_division_code,
        PostalCode: params.bill_addr_postal_code
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
          qb_account                         : qbConfig.account,
          id                                 : result.Id,
          given_name                         : result.GivenName,
          middle_name                        : result.MiddleName,
          family_name                        : result.FamilyName,
          fully_qualified_name               : result.FullyQualifiedName,
          company_name                       : result.CompanyName,
          display_name                       : result.DisplayName,
          print_on_check_name                : result.PrintOnCheckName,
          active                             : result.Active,
          email                              : _.get(result, 'PrimaryEmailAddr.Address'),
          bill_addr_line1                    : _.get(result, 'BillAddr.Line1'),
          bill_addr_city                     : _.get(result, 'BillAddr.City'),
          bill_addr_country_sub_division_code: _.get(result, 'BillAddr.CountrySubDivisionCode'),
          bill_addr_postal_code              : _.get(result, 'BillAddr.PostalCode'),
          currency_code                      : _.get(result, 'CurrencyRef.value')
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
    // const seriesNumber = params.series_number
    const qbo = this.getQBO(Configs.quickbooks[qbAccount])
    return new Promise((resolve, reject) => {
      qbo.createClass({
        Name: params.name
      }, (err, result) => {
        if (err) {
          return reject(err)
        }
        return QBClassModel.create({
          qb_account: qbAccount,
          id: result.Id,
          // series_number: seriesNumber,
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
