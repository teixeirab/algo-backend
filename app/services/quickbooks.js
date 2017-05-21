'use strict'
const async      = require('async')
const _          = require('lodash')
const moment     = require('moment')
const QuickBooks = require('node-quickbooks')
const numeral    = require('numeral')

module.exports = function(
  app,
  Configs,
  QBAPIAccountModel,
  SeriesProductInformationModel,
  SeriesAgentInformationModel,
  SeriesNamesModel,
  QBAccountIssuerModel,
  QBCustomerModel,
  QBClassModel,
  QBItemModel,
  QBTheoremItemModel,
  QBInvoiceTypeItemModel,
  QBInvoicesMaintenanceModel,
  QBInvoiceModel) {

  const that = this

  const customerMemo =  "Make checks payable in USD to: \n " +
                        "Bank: Bank of America \n" +
                        "Account Name: FlexFunds ETP LLC \n" +
                        "Account Number: 898067231257 \n" +
                        "Routing (wires): 026009593 SWIFT: BOFAUS3N \n" +
                        "(for all other currencies, please use BOFAUS6S) \n" +
                        "Address: 495 Brickell Avenue. Miami, FL 33131 \n" +
                        "\n" +
                        "If you have any questions concerning this invoice, \n" +
                        "contact us at accounting@flexfundsetp.com"

  const customFields = {
    'For': {
      'issuer_1': {
        DefinitionId: '1'
      },
      'flexfunds': {
        DefinitionId: '2'
      }
    }
  }

  this.getQBO = (config) => {
    return new QuickBooks(
      config.consumer_key,
      config.consumer_secret,
      config.token,
      config.token_secret,
      config.realm_id,
      config.use_sandbox,
      config.debug
    )
  }

  this.getAPIConfigs = (accountName) => {
    return QBAPIAccountModel.findOne({
      where: {
        name: accountName
      }
    })
  }

  this.calcExchangeRate = function(qb_account_key, fromCcy, toCcy) {
    return new Promise((resolve, reject) => {
      if(fromCcy === toCcy) {
        return resolve(1)
      }
      const twoWeekAgo = moment().subtract(2, 'weeks').format('YYYY-MM-DD')
      that.getAPIConfigs(qb_account_key).then((qbConfig) => {
        const qbo = this.getQBO(qbConfig)
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
            }) || rates[0]
            let exchangeRate = latestSourceRate.Rate / latestTargetRate.Rate
            resolve(exchangeRate)
          }
        )
      })
    })
  }

  this.createInvoice = function(params) {
    const qbAccountKey = params.qb_account_key
    const fromCurrency = params.from_currency
    const toCurrency = _.get(params, 'invoice.CurrencyRef.value')
    return new Promise((resolve, reject) => {
      that.getAPIConfigs(qbAccountKey).then((qbConfig) => {
        const qbo = that.getQBO(qbConfig)
        that.calcExchangeRate(qbAccountKey, fromCurrency, toCurrency).then((rate) => {
          params.invoice.Line.forEach((line) => {
            line.Amount *= rate
          })
          // console.log(JSON.stringify(params, undefined, 2))
          // return resolve()
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
    })
  }

  /*
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
  */

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
                  value: customerMemo
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

  this.getQBConfigsBySeriesNumber = function(seriesNumber) {
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          SeriesAgentInformationModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((agentInfo) => {
            if (!agentInfo) {
              return cb({err: `no agent info found for series number: ${seriesNumber}`})
            }
            cb(undefined, agentInfo)
          })
        },
        (agentInfo, cb) => {
          QBAccountIssuerModel.findOne({
            where: {
              issuer: agentInfo.issuer
            }
          }).then((qbAccountIssuer) => {
            if (!qbAccountIssuer) {
              return cb({err: `no qb account issuer found for issuer:${qbAccountIssuer.issuer}`})
            }
            QBAPIAccountModel.findOne({
              where: {
                account: qbAccountIssuer.qb_account
              }
            }).then((_qbConfig) => {
              if (!_qbConfig) {
                return cb({err: `no qb api config found for account: ${qbAccountIssuer.qb_account}`})
              }
              cb(undefined, _qbConfig)
            })
          })
        }
      ], (err, qbConfig) => {
        if (err) {
          return reject(err)
        }
        resolve(qbConfig)
      })
    })
  }

  this.getInvoiceLinesForMaintenanceFees = function(params) {
    let maintenanceFees = params.maintenanceFees,
        seriesNumber    = maintenanceFees.series_number,
        from            = maintenanceFees.from,
        to              = maintenanceFees.to,
        classId         = params.classId,
        qbAccount       = params.qbAccount
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          SeriesNamesModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((seriesName) => {
            if (!seriesName) {
              return cb({err: `no series name found for series number: ${seriesNumber}`})
            }
            cb(undefined, seriesName)
          })
        },
        (seriesName, cb) => {
          QBItemModel.findAll({
            where: {
              qb_account: qbAccount
            }
          }).then((issuerItems) => {
            QBTheoremItemModel.findAll({
              where: {
                qb_account: qbAccount
              }
            }).then((theoremItems) => {
              let issuerTheoremItems = _.remove(issuerItems, (issuerItem) => {
                return _.find(theoremItems, (theoremItem) => {
                  if (!maintenanceFees[theoremItem.theorem_col]) {
                    return
                  }
                  let matched = theoremItem.qb_item_id == issuerItem.id
                  if (matched) {
                    issuerItem.item_amount = maintenanceFees[theoremItem.theorem_col]
                    issuerItem.category = theoremItem.category
                  }
                  return matched
                })
              })

              let groupedItems = _.groupBy(issuerTheoremItems, (issuerTheoremItem) => {
                return issuerTheoremItem.category
              })

              let lines = [{
                DetailType: 'DescriptionOnly',
                Description: `For ${seriesName.series_name} from ` + moment(from).format('MMMM Do') + ' to ' + moment(to).format('MMMM Do')
              }]
              Object.keys(groupedItems).forEach((category) => {
                let subTotal = 0
                if (category === 'management') {
                  lines.push({
                    DetailType: 'DescriptionOnly',
                    Description: 'Management Fees:'
                  })
                }
                if (category === 'operating') {
                  lines.push({
                    DetailType: 'DescriptionOnly',
                    Description: 'Operating Fees:'
                  })
                }
                groupedItems[category].forEach((item) => {
                  let line = {
                    Amount: item.item_amount,
                    DetailType: "SalesItemLineDetail",
                    Description: item.description,
                    SalesItemLineDetail: {
                      ItemRef: {
                        value: item.id
                      },
                      Qty: 1
                    }
                  }
                  if (classId) {
                    line.SalesItemLineDetail.ClassRef = {
                      value: classId
                    }
                  }
                  subTotal += item.item_amount > 0 ? item.item_amount : 0
                  lines.push(line)
                })
                if (subTotal && category !== 'null') {
                  lines.push({
                    DetailType: 'DescriptionOnly',
                    Description: 'Subtotal: $' + subTotal
                  })
                }
              })
              cb(undefined, lines)
            })
          })
        }
      ], (err, lines) => {
        if (err) {
          return reject(err)
        }
        resolve(lines)
      })
    })
  }

  this.createMaintenanceInvoiceFromIssuer = function(maintenanceFees) {
    const seriesNumber = maintenanceFees.series_number
    const from         = maintenanceFees.from
    const to           = maintenanceFees.to
    return new Promise((resolve, reject) => {
      let qbConfig
      async.waterfall([
        (cb) => {
          that.getQBConfigsBySeriesNumber(seriesNumber).then((_qbConfig) => {
            qbConfig = _qbConfig
            cb()
          }).catch((err) => {
            cb(err)
          })
        },
        (cb) => {
          const seriesName = `Series ${seriesNumber}`
          QBClassModel.findOne({
            where: {
              fully_qualified_name: seriesName,
              qb_account: qbConfig.account
            }
          }).then((cls) => {
            if(!cls) {
              return cb({err: `invalid series name ${seriesName}`})
            }
            cb(undefined, cls)
          })
        },
        (cls, cb) => {
          that.getInvoiceLinesForMaintenanceFees({
            maintenanceFees: maintenanceFees,
            classId: cls.id,
            qbAccount: qbConfig.account
          }).then((lines) => {
            cb(undefined, {Line: lines})
          }).catch(cb)
        },
        (invoice, cb) => {
          SeriesProductInformationModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((seriesProductInfo) => {
            const client_name = seriesProductInfo.client_name
            QBCustomerModel.findOne({
              where: {
                fully_qualified_name: client_name,
                qb_account: qbConfig.account
              }
            }).then((customer) => {
              _.assign(invoice, {
                CustomerRef: {
                  value: customer.id
                },
                CurrencyRef: {
                  value: customer.currency_code
                },
                BillEmail: {
                  Address: customer.email
                },
                EmailStatus: 'NeedToSend',
                CustomerMemo: {
                  value:  customerMemo
                },
                CustomField: [{
                  DefinitionId: customFields['For'][qbConfig.name].DefinitionId,
                  Name: 'For',
                  Type: 'StringType',
                  StringValue: `S${seriesNumber} - ` + moment(from).format('DD/MM/YYYY') + ' - ' + moment(to).format('DD/MM/YYYY')
                }]
              })
              cb(undefined, invoice)
            })
          })
        },
        (invoice, cb) => {
          that.createInvoice({
            qb_account_key: qbConfig.name,
            invoice: invoice,
            from_currency: 'USD'
          }).then((result) => {
            cb(undefined, result)
          }).catch((err) => {
            cb(err)
          })
        }
      ], (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  this.createMaintenanceInvoiceFromFlex = function(maintenanceFees) {
    const seriesNumber = maintenanceFees.series_number
    const from         = maintenanceFees.from
    const to           = maintenanceFees.to
    let clientName
    return new Promise((resolve, reject) => {
      let qbConfig
      async.waterfall([
        (cb) => {
          QBAPIAccountModel.findOne({
            where: {
              name: 'flexfunds'
            }
          }).then((_qbConfig) => {
            qbConfig = _qbConfig
            cb()
          })
        },
        (cb) => {
          SeriesAgentInformationModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((agentInfo) => {
            clientName = agentInfo.issuer
            cb()
          })
        },
        (cb) => {
          SeriesProductInformationModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((productInfo) => {
            QBClassModel.findOne({
              where: {
                fully_qualified_name: productInfo.product_type,
                qb_account: qbConfig.account
              }
            }).then((cls) => {
              if(!cls) {
                return cb({err: `invalid series name ${seriesName}`})
              }
              cb(undefined, cls)
            })
          })
        },
        (cls, cb) => {
          that.getInvoiceLinesForMaintenanceFees({
            maintenanceFees: maintenanceFees,
            classId: cls.id,
            qbAccount: qbConfig.account
          }).then((lines) => {
            cb(undefined, {Line: lines})
          }).catch(cb)
        },
        (invoice, cb) => {
          if (clientName === 'IA Capital Structures (Ireland) PLC.') {
            // clientName = 'IA Capital Structures (Ireland) PLC USD'
            clientName = 'test'
          }
          QBCustomerModel.findOne({
            where: {
              fully_qualified_name: clientName,
              qb_account: qbConfig.account
            }
          }).then((customer) => {
            if (!customer) {
              return cb({err: `no qb customer found: ${clientName}`})
            }
            _.assign(invoice, {
              CustomerRef: {
                value: customer.id
              },
              CurrencyRef: {
                value: customer.currency_code
              },
              BillEmail: {
                Address: customer.email
              },
              EmailStatus: 'NeedToSend',
              CustomerMemo: {
                value:  customerMemo
              },
              CustomField: [{
                DefinitionId: customFields['For'][qbConfig.name].DefinitionId,
                Name: 'For',
                Type: 'StringType',
                StringValue: `S${seriesNumber} - ` + moment(from).format('DD/MM/YYYY') + ' - ' + moment(to).format('DD/MM/YYYY')
              }]
            })
            cb(undefined, invoice)
          })
        },
        (invoice, cb) => {
          that.createInvoice({
            qb_account_key: qbConfig.name,
            invoice: invoice,
            from_currency: 'USD'
          }).then((result) => {
            cb(undefined, result)
          }).catch((err) => {
            cb(err)
          })
        }
      ], (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  this.createMaintenanceInvoice = function(params) {
    let seriesNumber = params.series_number,
        from         = params.from,
        to           = params.to
    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb) => {
          QBInvoicesMaintenanceModel
            .getOneBySeriesNumberInPeriod(seriesNumber, from, to)
            .then((maintenanceFees) => {
              if (!maintenanceFees) {
                return cb({err: `no maintenance fees found for series_number: ${seriesNumber}`})
              }
              cb(undefined, maintenanceFees)
            })
        },
        (maintenanceFees, cb) => {
          that.createMaintenanceInvoiceFromIssuer(maintenanceFees).then(() => {
            cb(undefined, maintenanceFees)
          }).catch(cb)
        },
        (maintenanceFees, cb) => {
          that.createMaintenanceInvoiceFromFlex(maintenanceFees).then(() => {
            cb(undefined, maintenanceFees)
          }).catch(cb)
        },
        (maintenanceFeesModel, cb) => {
          maintenanceFeesModel.invoice_sent_date = new Date()
          maintenanceFeesModel.save().then(() => {
            cb(undefined, maintenanceFeesModel)
          })
        }
      ], (err, maintenanceFeesModel) => {
        if (err) {
          return reject(err)
        }
        resolve(maintenanceFeesModel)
      })
    })
  }

  this.createInterestInvoice = function(interest) {
    const seriesNumber = interest['Series Number']
    return new Promise((resolve, reject) => {
      let qbConfig
      async.waterfall([
        (cb) => {
          that.getQBConfigsBySeriesNumber(seriesNumber).then((_qbConfig) => {
            qbConfig = _qbConfig
            cb()
          }).catch((err) => {
            cb(err)
          })
        },
        (cb) => {
          const seriesName = `Series ${seriesNumber}`
          QBClassModel.findOne({
            where: {
              fully_qualified_name: seriesName,
              qb_account: qbConfig.account
            }
          }).then((cls) => {
            if(!cls) {
              return cb({err: `invalid series name ${seriesName}`})
            }
            cb(undefined, cls)
          })
        },
        (cls, cb) => {
          let lines = []
          if (interest['Previous Payment Date'] || interest['Loan Payment Date']) {
            lines.push({
              DetailType: 'DescriptionOnly',
              Description: 'Interest Notification - Period ' + moment(interest['Previous Payment Date']).format('DD/MM/YYYY') + ' - ' + moment(interest['Loan Payment Date']).format('DD/MM/YYYY')
            })
          }
          if (interest['Interest Rate']) {
            lines.push({
              DetailType: 'DescriptionOnly',
              Description: 'Interest Rate - ' + (interest['Interest Rate'] * 100).toFixed(2) + '%'
            })
          }
          if (interest['Nominal Basis']) {
            lines.push({
              DetailType: 'DescriptionOnly',
              Description: 'Nominal Basis - ' + numeral(interest['Nominal Basis']).format('$0,0.00')
            })
          }
          async.eachSeries(['Interest Payable', 'Purchased Accrued Interest', 'Cash Round Up'], (itemName, cb) => {
            QBItemModel.findOne({
              where: {
                name: itemName,
                qb_account: qbConfig.account
              }
            }).then((item) => {
              if (!item) {
                return cb()
              }
              let amount
              if (item.name === 'Interest Payable') {
                amount = interest['Interest Income']
              }
              if (item.name === 'Purchased Accrued Interest') {
                amount = interest['Interest Repayment']
              }
              if (item.name === 'Cash Round Up') {
                amount = interest['Cash Round Up']
              }
              if (amount) {
                lines.push({
                  Amount: amount,
                  DetailType: "SalesItemLineDetail",
                  Description: item.description,
                  SalesItemLineDetail: {
                    ItemRef: {
                      value: item.id
                    },
                    ClassRef: {
                      value: cls.id
                    },
                    Qty: 1
                  }
                })
              }
              cb()
            })
          }, (err) => {
            let invoice = {Line: lines}
            cb(err, invoice)
          })
        },
        (invoice, cb) => {
          SeriesProductInformationModel.findOne({
            where: {
              series_number: seriesNumber
            }
          }).then((seriesProductInfo) => {
            const client_name = seriesProductInfo.client_name
            QBCustomerModel.findOne({
              where: {
                fully_qualified_name: client_name,
                qb_account: qbConfig.account
              }
            }).then((customer) => {
              _.assign(invoice, {
                CustomerRef: {
                  value: customer.id
                },
                CurrencyRef: {
                  value: customer.currency_code
                },
                BillEmail: {
                  Address: customer.email
                },
                EmailStatus: 'NeedToSend',
                CustomerMemo: {
                  value:  customerMemo
                }
              })
              cb(undefined, invoice)
            })
          })
        },
        (invoice, cb) => {
          that.createInvoice({
            qb_account_key: qbConfig.name,
            invoice: invoice,
            from_currency: 'USD'
          }).then((result) => {
            cb(undefined, result)
          }).catch((err) => {
            cb(err)
          })
        }
      ], (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
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
