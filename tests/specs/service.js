'use strict'

var async = require('async');
var assert = require('assert');
var moment = require('moment');
var request = require('supertest')
var helper = require('../../tests/helper')
global.app = require('../../app/setup')
var _ = require('lodash');
describe('service tests', function() {
  let vars = [
    'PerformanceService',
    'QuickBookService',
    'TheoremBalanceSheetModel',
    'SeriesProductInformationModel',
    'QBCustomerModel',
    'QBInvoiceModel',
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
          series_number: Math.random()
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
    describe.only('api', function () {
      describe('invoice', function () {
        it('generate setup invoice', function (done) {
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
            request(app)
              .post('/api/panel/qb/setup-invoice')
              .set('internal-key', '123')
              .send({
                customer_name: '0.9035172225072845',
                product_type: 'wrappers'
              })
              .end((err, res) => {
                console.log(JSON.stringify(res.body))
                done()
              })
          })
        });
      });
      describe.only('customer', function () {
        it('create customer', function (done) {
          request(app)
            .post('/api/panel/qb/customer')
            .set('internal-key', '123')
            .send({
              display_name: 'test5',
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
