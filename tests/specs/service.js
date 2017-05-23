'use strict'

var async = require('async');
var assert = require('assert');
var moment = require('moment');
var request = require('supertest')
var sinon = require('sinon')
var helper = require('../../tests/helper')
global.app = require('../../app/setup')
var _ = require('lodash');
describe('service tests', function() {
  let vars = [
    'PerformanceService',
    'QuickBookService',
    'SqlService',
    'TheoremBalanceSheetModel',
    'SeriesProductInformationModel',
    'SeriesAgentInformationModel',
    'BorrowersModel',
    'AdvancesInterestScheduleModel',
    'QBCustomerModel',
    'QBInvoiceModel',
    'QBClassModel',
    'QBInvoicesMaintenanceModel',
    'QBAccountIssuerModel',
    'FlexFundsDB'
  ]
  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }
  before(function(done) {
    app.run(done)
  })
  beforeEach(function(done) {
    vars.forEach(function(dep) {
      vars[dep] = app.summon.get(dep)
    })
    vars['FlexFundsDB'].sync({
      // logging: console.log,
      force: true
    }).then(function() {
      done();
    });
  });
  describe('performance', function () {
    it('monthly returns based on monthly period', function (done) {
      const seriesNumber = 1
      helper.batchCreateInstances([
        ['SeriesProductInformationModel', [
          {nav_frequency: 'Monthly', series_number: 1, bloomberg_name: 'a', product_type: 'Fund', issue_date: new Date(), maturity_date: new Date(), region: 'South Cone', currency: 'USD'}
        ]],
        ['TheoremBalanceSheetModel', [
          {period: moment('2016-03-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1},
          {period: moment('2016-04-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1.1},
          {period: moment('2016-04-30'), series_number: 2, type: 'Monthly', nav_per_unit: 3},
          {period: moment('2016-05-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1.21}
        ]]
      ], () => {
        vars['PerformanceService'].getMonthlyReturns(seriesNumber).then((returns) => {
          assert.equal(3, returns.length)
          assert.equal(0, returns[0].monthlyReturn)
          assert.equal(0.1, returns[1].monthlyReturn)
          assert.equal(0.1, returns[2].monthlyReturn)
          done()
        })
      })
    });
    it('monthly returns based on weekly period', function (done) {
      const seriesNumber = 1
      helper.batchCreateInstances([
        ['SeriesProductInformationModel', [
          {nav_frequency: 'Weekly', series_number: 1, bloomberg_name: 'a', product_type: 'Fund', issue_date: new Date(), maturity_date: new Date(), region: 'South Cone', currency: 'USD'}
        ]],
        ['TheoremBalanceSheetModel',[
          {period: moment('2016-03-23'), series_number: 1, type: 'Weekly', nav_per_unit: 1},
          {period: moment('2016-03-30'), series_number: 1, type: 'Weekly', nav_per_unit: 1},
          {period: moment('2016-04-07'), series_number: 1, type: 'Weekly', nav_per_unit: 1.1},
          {period: moment('2016-04-14'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-04-21'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-04-28'), series_number: 1, type: 'Weekly', nav_per_unit: 1.1},
          {period: moment('2016-05-05'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-05-12'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-05-19'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-05-26'), series_number: 1, type: 'Weekly', nav_per_unit: 1.2},
          {period: moment('2016-06-03'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-06-10'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-06-17'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-06-24'), series_number: 1, type: 'Weekly', nav_per_unit: 1.21},
          {period: moment('2016-06-30'), series_number: 1, type: 'Weekly', nav_per_unit: 1.3}
        ]]
      ], () => {
        vars['PerformanceService'].getMonthlyReturns(seriesNumber).then((returns) => {
          assert.equal(15, returns.length)
          assert.equal(0, returns[0].monthlyReturn)
          assert.equal(0, returns[1].monthlyReturn)
          assert.equal(0, returns[2].monthlyReturn)
          assert.equal(0, returns[3].monthlyReturn)
          assert.equal(0.21, returns[4].monthlyReturn)
          assert.equal(0.1, returns[5].monthlyReturn)
          assert.equal(0.1, returns[6].monthlyReturn)
          assert.equal(0, returns[7].monthlyReturn)
          done()
        })
      })
    });
    it('should filter out the zero nav reports', function (done) {
      const seriesNumber = 1
      helper.batchCreateInstances([
        ['SeriesProductInformationModel', [
          {nav_frequency: 'Monthly', series_number: 1, bloomberg_name: 'a', product_type: 'Fund', issue_date: new Date(), maturity_date: new Date(), region: 'South Cone', currency: 'USD'}
        ]],
        ['TheoremBalanceSheetModel', [
          {period: moment('2016-02-28'), series_number: 1, type: 'Monthly', nav_per_unit: 0},
          {period: moment('2016-03-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1},
          {period: moment('2016-04-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1.1},
          {period: moment('2016-04-30'), series_number: 2, type: 'Monthly', nav_per_unit: 3},
          {period: moment('2016-05-30'), series_number: 1, type: 'Monthly', nav_per_unit: 1.21},
          {period: moment('2016-06-28'), series_number: 1, type: 'Monthly', nav_per_unit: 0}
        ]]
      ], () => {
        vars['PerformanceService'].getMonthlyReturns(seriesNumber).then((returns) => {
          assert.equal(3, returns.length)
          assert.equal(0, returns[0].monthlyReturn)
          assert.equal(0.1, returns[1].monthlyReturn)
          assert.equal(0.1, returns[2].monthlyReturn)
          done()
        })
      })
    });
  });
  describe.only('qb tests', function () {
    describe('service', function () {
      it('create customer', function (done) {
        const params = {
          qb_account: 'flexfunds',
          email: 'kata.choi@gmail.com',
          given_name: 'kata',
          family_name: 'choi',
          fully_qualified_name: 'kc',
          company_name: 'comp',
          display_name: '' + Math.random(100000),
          print_on_check_name: 'kc',
          bill_addr_line_1: 'addr line 1',
          bill_addr_city: 'city',
          bill_addr_country_sub_division_code: '1111',
          bill_addr_postal_code: '123',
          currency_code: 'AUD'
        }
        vars['QuickBookService']
        .createCustomer(params)
        .then((result) => {
          console.log(JSON.stringify(result, undefined, 2))
          done();
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          done()
        })
      });
      it('create class', function (done) {
        vars['QuickBookService']
        .createClass({
          qb_account: 'flexfunds',
          name: 'Fund'
        })
        .then((result) => {
          console.log(JSON.stringify(result, undefined, 2))
          done();
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          done()
        })
      });
      it('create item', function (done) {
        vars['QuickBookService']
        .createItem({
          qb_account: 'flexfunds',
          name: Math.random(),
          type: 'Service',
          description: 'Service',
          income_account_id: 1,
          expense_account_id: 2,
          asset_account_id: 81,
        })
        .then((item) => {
          console.log(item.toJSON())
          done();
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          done()
        })
      });
      it('create invoices', function (done) {
        helper.batchCreateInstances([
          ['QBInvoiceTypeItemModel', [
            {invoice_type: 'FUNDS', item_id: 1, item_amount: 100},
            {invoice_type: 'FUNDS', item_id: 2, item_amount: 100},
            {invoice_type: 'WRAPPERS', item_id: 3, item_amount: 100}
          ]],
          ['QBCustomerModel', [
            {id: 2, qb_account: 'test', display_name: 'kc', currency_code: 'USD'},
            {id: 3, qb_account: 'flexfunds', display_name: '0.9035172225072845', currency_code: 'AUD', email: 'kata.choi@gmail.com'}
          ]]
        ], () => {
          vars['QuickBookService']
            .generateSetUpInvoice({
              customer_name: '0.9035172225072845',
              product_type: 'Funds'
            })
            .then((createdInvoice) => {
              console.log(createdInvoice)
              vars['QBInvoiceModel'].findAll().then((invoices) => {
                assert.equal(1, invoices.length)
                console.log(JSON.stringify(invoices[0].toJSON()))
                done();
              })
            })
            .catch((err) => {
              console.log(JSON.stringify(err, undefined, 2))
              done()
            })
        })
      });
    });
    describe('api', function () {
      describe.only('invoice', function () {
        afterEach(function () {
          if(vars['QuickBookService'].createInvoice.restore) {
            vars['QuickBookService'].createInvoice.restore()
          }
        });
        xit('generate setup invoice', function (done) {
          helper.batchCreateInstances([
            ['QBClassModel', [
              {
                id: "5000000000000027881",
                qb_account: "flexfunds",
                name: 'Fund',
                fully_qualified_name: 'Fund'
              }
            ]],
            ['QBItemModel', [
              {id: 1, name: 'name', qb_account: 'kata.choi@gmail.com', description: 'item test desc'},
              {id: 2, name: 'name', qb_account: 'kata.choi@gmail.com', description: 'item test desc'},
              {id: 3, name: 'name', qb_account: 'kata.choi@gmail.com', description: 'item test desc'}
            ]],
            ['QBInvoiceTypeItemModel', [
              {invoice_type: 'FUNDS', qb_account: 'kata.choi@gmail.com', item_id: 1, item_amount: 100, item_currency: 'EUR'},
              {invoice_type: 'FUNDS', qb_account: 'kata.choi@gmail.com', item_id: 2, item_amount: 100, item_currency: 'EUR'},
              {invoice_type: 'WRAPPERS', qb_account: 'kata.choi@gmail.com', item_id: 3, item_amount: 100, item_currency: 'EUR'}
            ]],
            ['QBCustomerModel', [
              {id: 2, qb_account: 'test', display_name: 'kc', currency_code: 'USD'},
              {id: 3, qb_account: 'kata.choi@gmail.com', display_name: '0.9035172225072845', currency_code: 'USD', email: 'kata.choi@gmail.com'}
            ]],
            ['QBAPIAccountModel', [
              {name: 'flexfunds', account: 'kata.choi@gmail.com', token_expires_date: new Date(), consumer_key: 'qyprdmo0k4zNWYg02AAuGfqaoC1mAr', consumer_secret: 'vY0ivLWoS88RwfZzjTSbVs661O1rtcNMIB8Q8dHq', token: 'qyprdd2brFdkST5neF228WkeabLldEPBkPfusLrQQjAQmyx0', token_secret: '06EtkSduVSqaWRvVLLQkLQcSZjFTa7ZS7hXxET4I', realm_id: '123145808149854', use_sandbox: true, debug: false}
            ]]
          ], () => {
            request(app)
              .post('/api/panel/qb/setup-invoice')
              .set('internal-key', '123')
              .send({
                customer_name: '0.9035172225072845',
                product_type: 'funds',
                series_name: 'test series'
              })
              .end((err, res) => {
                console.log(JSON.stringify(res.body))
                done()
              })
          })
        });
        it('generate maintenance invoice', function (done) {
          const seriesNumber = 1, from = '2016-01-01', to = '2016-12-31', issuer_qb_account = 'kata.choi@gmail.com', flex_qb_account = 'katat.choi@gmail.com'
          helper.batchCreateInstances([
            ['QBClassModel', [
              {
                id: "5000000000000027881",
                qb_account: issuer_qb_account,
                name: '1',
                fully_qualified_name: '1'
              },{
                id: "5000000000000027882",
                qb_account: flex_qb_account,
                name: 'Fund',
                fully_qualified_name: 'Fund'
              }
            ]],
            ['SeriesAgentInformationModel', [
              {series_number: seriesNumber, issuer: 'test'}
            ]],
            ['QBAccountIssuerModel', [
              {qb_account: issuer_qb_account, issuer: 'test'}
            ]],
            ['QBInvoicesMaintenanceModel', [
              {series_number: seriesNumber, from: new Date(from), to: new Date(to), audit_fees: 100, administrator_fees: 100, arranger_fees: 50},
              {series_number: 2, from: new Date(from), to: new Date(to), audit_fees: 100, administrator_fees: 100, arranger_fees: 50}
            ]],
            ['QBItemModel', [
              {id: 1, name: 'audit_fees', qb_account: issuer_qb_account, description: 'item test desc'},
              {id: 2, name: 'administrator_fees', qb_account: issuer_qb_account, description: 'item test desc'},
              {id: 2, name: 'this not use this', qb_account: flex_qb_account, description: 'this not use this'},
              {id: 3, name: 'arranger_fees', qb_account: flex_qb_account, description: 'item test desc'}
            ]],
            ['QBTheoremItemModel', [
              {theorem_col: 'audit_fees', qb_item_id: 1, qb_account: issuer_qb_account, category: 'operating'},
              {theorem_col: 'administrator_fees', qb_item_id: 2, qb_account: issuer_qb_account, category: 'management'},
              {theorem_col: 'arranger_fees', qb_item_id: 3, qb_account: flex_qb_account}
            ]],
            ['QBCustomerModel', [
              {id: 2, qb_account: flex_qb_account, fully_qualified_name: 'test', display_name: 'IA Capital Structures (Ireland) PLC.', currency_code: 'USD', email: flex_qb_account},
              {id: 3, qb_account: issuer_qb_account, fully_qualified_name: '0.9035172225072845', display_name: '0.9035172225072845', currency_code: 'USD', email: issuer_qb_account}
            ]],
            ['SeriesProductInformationModel', [
              {series_number: seriesNumber, client_name: '0.9035172225072845', bloomberg_name: '', product_type: 'Fund', issue_date: new Date(), maturity_date: new Date(), region: '', nav_frequency: '', currency: ''}
            ]],
            ['SeriesNamesModel', [
              {series_number: seriesNumber, series_name: 'Series Name 1', common_code: '1', isin: '1'}
            ]],
            ['QBAPIAccountModel', [
              {name: 'issuer_1', account: issuer_qb_account, token_expires_date: new Date(), consumer_key: 'qyprdmo0k4zNWYg02AAuGfqaoC1mAr', consumer_secret: 'vY0ivLWoS88RwfZzjTSbVs661O1rtcNMIB8Q8dHq', token: 'qyprdd2brFdkST5neF228WkeabLldEPBkPfusLrQQjAQmyx0', token_secret: '06EtkSduVSqaWRvVLLQkLQcSZjFTa7ZS7hXxET4I', realm_id: '123145808149854', use_sandbox: true, debug: false},
              {name: 'flexfunds', account: flex_qb_account, token_expires_date: new Date(), consumer_key: 'qyprdmo0k4zNWYg02AAuGfqaoC1mAr', consumer_secret: 'vY0ivLWoS88RwfZzjTSbVs661O1rtcNMIB8Q8dHq', token: 'qyprdd2brFdkST5neF228WkeabLldEPBkPfusLrQQjAQmyx0', token_secret: '06EtkSduVSqaWRvVLLQkLQcSZjFTa7ZS7hXxET4I', realm_id: '123145808149854', use_sandbox: true, debug: false}
            ]]
          ], () => {
            let count = 0
            sinon.stub(vars['QuickBookService'], 'createInvoice').callsFake(function (params) {
              count ++
              assert.equal('USD', params.from_currency)
              if (count === 1) {
                assert.equal('issuer_1', params.qb_account_key)
                let expectedInvoice = {
                  "Line":[{
                    "DetailType":"DescriptionOnly",
                    "Description":"For Series Name 1 from January 1st to December 31st"
                  },{
                    DetailType: 'DescriptionOnly',
                    Description: 'Operating Fees:'
                  },{
                    "Amount":100,
                    "DetailType":"SalesItemLineDetail",
                    "Description":"item test desc",
                    "SalesItemLineDetail":{
                      "ItemRef":{"value":1},"Qty":1,"ClassRef":{"value":"5000000000000027881"}
                    }
                  },{
                    "DetailType": "DescriptionOnly",
                    "Description": 'Subtotal: $100'
                  },{
                    DetailType: 'DescriptionOnly',
                    Description: 'Management Fees:'
                  },{
                    "Amount":100,
                    "DetailType":"SalesItemLineDetail",
                    "Description":"item test desc",
                    "SalesItemLineDetail":{
                      "ItemRef":{"value":2},"Qty":1,"ClassRef":{"value":"5000000000000027881"}
                    }
                  },{
                    "DetailType": "DescriptionOnly",
                    "Description": 'Subtotal: $100'
                  }],
                  "CustomerRef":{
                    "value":3
                  },
                  "CurrencyRef":{
                    "value":"USD"
                  },
                  "BillEmail":{
                    "Address":"kata.choi@gmail.com"
                  },
                  "EmailStatus":"NeedToSend",
                  "CustomerMemo":{
                    "value":"Make checks payable in USD to: \n Bank: Bank of America \nAccount Name: FlexFunds ETP LLC \nAccount Number: 898067231257 \nRouting (wires): 026009593 SWIFT: BOFAUS3N \n(for all other currencies, please use BOFAUS6S) \nAddress: 495 Brickell Avenue. Miami, FL 33131 \n\nIf you have any questions concerning this invoice, \ncontact us at accounting@flexfundsetp.com"
                  },
                  "CustomField":[{
                    "DefinitionId":"1",
                    "Name":"For",
                    "Type":"StringType",
                    "StringValue":"S1 - 01/01/2016 - 31/12/2016"
                  }]
                }
                assert.equal(JSON.stringify(expectedInvoice), JSON.stringify(params.invoice))
              }
              if (count === 2) {
                assert.equal('flexfunds', params.qb_account_key)
                let expectedInvoice = {
                  "Line":[{
                    "DetailType":"DescriptionOnly",
                    "Description":"For Series Name 1 from January 1st to December 31st"
                  },{
                    "Amount":50,
                    "DetailType":"SalesItemLineDetail",
                    "Description":"item test desc",
                    "SalesItemLineDetail":{
                      "ItemRef":{"value":3},"Qty":1,"ClassRef":{"value":"5000000000000027882"}
                    }
                  }],
                  "CustomerRef":{
                    "value":2
                  },
                  "CurrencyRef":{
                    "value":"USD"
                  },
                  "BillEmail":{
                    "Address":"katat.choi@gmail.com"
                  },
                  "EmailStatus":"NeedToSend",
                  "CustomerMemo":{
                    "value":"Make checks payable in USD to: \n Bank: Bank of America \nAccount Name: FlexFunds ETP LLC \nAccount Number: 898067231257 \nRouting (wires): 026009593 SWIFT: BOFAUS3N \n(for all other currencies, please use BOFAUS6S) \nAddress: 495 Brickell Avenue. Miami, FL 33131 \n\nIf you have any questions concerning this invoice, \ncontact us at accounting@flexfundsetp.com"
                  },
                  "CustomField":[{
                    "DefinitionId":"2",
                    "Name":"For",
                    "Type":"StringType",
                    "StringValue":"S1 - 01/01/2016 - 31/12/2016"
                  }]
                }
                assert.deepEqual(expectedInvoice, params.invoice)
              }
              return new Promise((resolve, reject) => {
                resolve()
              })
            });
            request(app)
              .post('/api/panel/qb/maintenance-invoice/' + seriesNumber)
              .set('internal-key', '123')
              .send({
                from: from,
                to: to
              })
              .end((err, res) => {
                assert.equal(2, count)
                vars['QBInvoicesMaintenanceModel'].findAll().then((invs) => {
                  assert.equal(2, invs.length)
                  assert.equal(1, invs[0].series_number)
                  assert(invs[0].invoice_sent_date)
                  assert.equal(2, invs[1].series_number)
                  assert(!invs[1].invoice_sent_date)
                  done()
                })
              })
          })
        });
        it('generate interest invoice', function (done) {
          const seriesNumber = 1, issuer_qb_account = 'kata.choi@gmail.com'
          helper.batchCreateInstances([
            ['QBClassModel', [
              {
                id: "5000000000000027881",
                qb_account: issuer_qb_account,
                name: '1',
                fully_qualified_name: '1'
              }
            ]],
            ['SeriesAgentInformationModel', [
              {series_number: seriesNumber, issuer: 'test'}
            ]],
            ['QBAccountIssuerModel', [
              {qb_account: issuer_qb_account, issuer: 'test'}
            ]],
            ['QBItemModel', [
              {id: 1, name: 'Interest Payable', qb_account: issuer_qb_account, description: 'item test desc'},
              {id: 2, name: 'Purchased Accrued Interest', qb_account: issuer_qb_account, description: 'item test desc'},
              {id: 3, name: 'Cash Round Up', qb_account: issuer_qb_account, description: 'test'}
            ]],
            ['QBCustomerModel', [
              {id: 2, qb_account: issuer_qb_account, fully_qualified_name: '0.9035172225072845', display_name: 'IA Capital Structures (Ireland) PLC.', currency_code: 'USD', email: issuer_qb_account},
              {id: 1, qb_account: issuer_qb_account, fully_qualified_name: 'test1', display_name: 'IA Capital Structures (Ireland) PLC.', currency_code: 'USD', email: issuer_qb_account},
              {id: 3, qb_account: issuer_qb_account, fully_qualified_name: 'test2', display_name: 'IA Capital Structures (Ireland) PLC.', currency_code: 'USD', email: issuer_qb_account}
            ]],
            ['SeriesProductInformationModel', [
              {series_number: seriesNumber, client_name: 'test1', bloomberg_name: '', product_type: 'Fund', issue_date: new Date(), maturity_date: new Date(), region: '', nav_frequency: '', currency: ''}
            ]],
            ['AdvancesInterestScheduleModel', [
              {id: 1, series_number: seriesNumber, loan_payment_date: new Date(2017, 1, 1), interest_determination_date: new Date(2017, 2, 1), series_interest_payment_date: new Date(2017, 2, 1), previous_payment_date: new Date(2016, 0, 1), invoice_sent: 'No'},
              {id: 2, series_number: seriesNumber, loan_payment_date: new Date(2017, 1, 1), interest_determination_date: new Date(2017, 2, 1), series_interest_payment_date: new Date(2017, 2, 1), previous_payment_date: new Date(2017, 0, 1), invoice_sent: 'No'},
              {id: 3, series_number: 2, loan_payment_date: new Date(2017, 1, 1), interest_determination_date: new Date(2017, 2, 1), series_interest_payment_date: new Date(2017, 2, 1), previous_payment_date: new Date(2017, 0, 1), invoice_sent: 'No'}
            ]],
            ['BorrowersModel', [
              {id: 1, client_name: 'test1', series_number: seriesNumber, contact_name: '1', percent_outstanding: 0.5},
              {id: 2, client_name: 'test2', series_number: seriesNumber, contact_name: '1', percent_outstanding: 0.5},
              {id: 3, client_name: 'test', series_number: 2, contact_name: '1', percent_outstanding: 0.5},
            ]],
            ['QBAPIAccountModel', [
              {name: 'issuer_1', account: issuer_qb_account, token_expires_date: new Date(), consumer_key: 'qyprdmo0k4zNWYg02AAuGfqaoC1mAr', consumer_secret: 'vY0ivLWoS88RwfZzjTSbVs661O1rtcNMIB8Q8dHq', token: 'qyprdd2brFdkST5neF228WkeabLldEPBkPfusLrQQjAQmyx0', token_secret: '06EtkSduVSqaWRvVLLQkLQcSZjFTa7ZS7hXxET4I', realm_id: '123145808149854', use_sandbox: true, debug: false}
            ]],
            ['UsersModel', [
              {user_type: 'Trading', first_name: '1', last_name: '1', cell_phone: '1', email: '1', password: '1', apikey: '123', status: 'A', use_sandbox: true, debug: false}
            ]]
          ], () => {
            let count = 0
            let from = new Date(2017, 0, 1), to = new Date(2017, 1, 1)
            let cashRoundUp = 100
            let interestData = [{
              "Series Number": "1",
              "Previous Payment Date": from,
              "Loan Payment Date": to,
              "Nominal Basis": 10000,
              "Interest Rate": 0.1,
              "Interest Repayment": 10000,
              "Interest Income": 10000,
              "Principal Repayment": 0,
              "Cash Round Up": cashRoundUp,
              "Invoice Sent": "No"
            }]
            sinon.stub(vars['SqlService'], 'viewData').callsFake(function (params) {
              return new Promise((resolve, reject) => {
                resolve(interestData)
              })
            });
            count = 0
            sinon.stub(vars['QuickBookService'], 'createInvoice').callsFake(function (params) {
              count++
              let expectedParams = {
                "qb_account_key": "issuer_1",
                "invoice": {
                  "Line": [
                    {
                      "DetailType": "DescriptionOnly",
                      "Description": `Interest Notification - Period ${moment(from).format('DD/MM/YYYY')} - ${moment(to).format('DD/MM/YYYY')}`
                    },
                    {
                      "DetailType": "DescriptionOnly",
                      "Description": "Interest Rate - 5.00%"
                    },
                    {
                      "DetailType": "DescriptionOnly",
                      "Description": "Nominal Basis - $5,000.00"
                    },
                    {
                      "Amount": 10000/2,
                      "DetailType": "SalesItemLineDetail",
                      "Description": "item test desc",
                      "SalesItemLineDetail": {
                        "ItemRef": {
                          "value": 1
                        },
                        "ClassRef": {
                          "value": "5000000000000027881"
                        },
                        "Qty": 1
                      }
                    },
                    {
                      "Amount": 10000/2,
                      "DetailType": "SalesItemLineDetail",
                      "Description": "item test desc",
                      "SalesItemLineDetail": {
                        "ItemRef": {
                          "value": 2
                        },
                        "ClassRef": {
                          "value": "5000000000000027881"
                        },
                        "Qty": 1
                      }
                    },
                    {
                      "Amount": cashRoundUp/20,
                      "DetailType": "SalesItemLineDetail",
                      "Description": "test",
                      "SalesItemLineDetail": {
                        "ItemRef": {
                          "value": 3
                        },
                        "ClassRef": {
                          "value": "5000000000000027881"
                        },
                        "Qty": 1
                      }
                    }
                  ],
                  "CustomerRef": {
                    "value": count === 1 ? 1: 3
                  },
                  "CurrencyRef": {
                    "value": "USD"
                  },
                  "BillEmail": {
                    "Address": "kata.choi@gmail.com"
                  },
                  "EmailStatus": "NeedToSend",
                  "CustomerMemo": {
                    "value": "Make checks payable in USD to: \n Bank: Bank of America \nAccount Name: FlexFunds ETP LLC \nAccount Number: 898067231257 \nRouting (wires): 026009593 SWIFT: BOFAUS3N \n(for all other currencies, please use BOFAUS6S) \nAddress: 495 Brickell Avenue. Miami, FL 33131 \n\nIf you have any questions concerning this invoice, \ncontact us at accounting@flexfundsetp.com"
                  }
                },
                "from_currency": "USD"
              }
              assert.equal(JSON.stringify(expectedParams), JSON.stringify(params))
              return new Promise((resolve, reject) => {
                resolve()
              })
            })
            let interestParams = _.clone(interestData[0])
            interestParams['Cash Round Up'] = cashRoundUp/10
            request(app)
              .post('/api/panel/qb/interest-invoice/' + seriesNumber)
              .set('x-apikey', '123')
              .send(interestParams)
              .end((err, res) => {
                vars['AdvancesInterestScheduleModel'].findAll().then((schedules) => {
                  assert.equal(3, schedules.length)
                  assert.equal('No', schedules[0].invoice_sent)
                  assert.equal('No', schedules[2].invoice_sent)
                  assert.equal('Yes', schedules[1].invoice_sent)
                  assert.equal(formatDate(to), formatDate(schedules[1].loan_payment_date))
                  assert.equal(formatDate(from), formatDate(schedules[1].previous_payment_date))
                  assert.equal(seriesNumber, schedules[1].series_number)
                  done()
                })
              })
          })
        });
      });
      describe('customer', function () {
        it('create customer', function (done) {
          request(app)
            .post('/api/panel/qb/customer')
            .set('internal-key', '123')
            .send({
              display_name: 'test7',
              given_name: 'test',
              family_name: 'test',
              fully_qualified_name: 'test1',
              company_name: 'test1',
              email: 'kata.choi@gmail.com',
              bill_addr_line_1: '111',
              bill_addr_city: '111',
              bill_addr_country_sub_division_code: '111',
              bill_addr_postal_code: '111',
              print_on_check_name: '111',
              currency_code: 'aud'
            })
            .end((err, res) => {
              console.log(JSON.stringify(res.body))
              done()
            })
        });
      });
    });
  });
});
