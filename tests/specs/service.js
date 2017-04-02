'use strict'

var async = require('async');
var assert = require('assert');
var moment = require('moment');
var helper = require('../../tests/helper')
global.app = require('../../app/setup')
var _ = require('lodash');
describe('service tests', function() {
  let vars = [
    'PerformanceService',
    'TheoremBalanceSheetModel',
    'SeriesProductInformationModel',
    'FlexFundsDB'
  ]
  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }
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
        vars['PerformanceService'].getMonthlyReturns(seriesNumber, 'Monthly').then((returns) => {
          assert.equal(2, returns.length)
          assert.equal(0.1, returns[0].growth)
          assert.equal(0.1, returns[1].growth)
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
        vars['PerformanceService'].getMonthlyReturns(seriesNumber, 'Weekly').then((returns) => {
          assert.equal(3, returns.length)
          assert.equal(0.1, returns[0].growth)
          assert.equal(0.091, returns[1].growth)
          assert.equal(0.083, returns[2].growth)
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
        vars['PerformanceService'].getMonthlyReturns(seriesNumber, 'Monthly').then((returns) => {
          assert.equal(2, returns.length)
          assert.equal(0.1, returns[0].growth)
          assert.equal(0.1, returns[1].growth)
          done()
        })
      })
    });
  });
});
