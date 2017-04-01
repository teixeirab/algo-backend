'use strict'
const async = require('async')
const moment = require('moment')

module.exports = function(PerformanceService) {
  const that = this
  this.refreshAPIKey = function(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
  };

  this.getHistoryPerformance = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    async.waterfall([
      function(cb) {
        PerformanceService
          .getMonthlyData(seriesNumber)
          .then((monthlyData) => {
            cb(undefined, monthlyData)
          })
      },
      function(monthlyData, cb) {
        let monthlyReturns = PerformanceService.calcMonthlyReturns(monthlyData)
        cb(undefined, monthlyData, monthlyReturns)
      },
      function(monthlyData, monthlyReturns, cb) {
        let cumulativeReturns = PerformanceService.calcCumulativeReturns(monthlyData)
        monthlyReturns.forEach((ret) => {
          cumulativeReturns.forEach((cumRet) => {
            if(cumRet.period.toISOString() === ret.period.toISOString()) {
              ret.cumulativeReturn = cumRet.cumulativeReturn
            }
          })
        })
        cb(undefined, monthlyReturns)
      }
    ], (err, monthlyReturns) => {
      res.send(monthlyReturns)
    })
  }

  this.getRiskData = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    PerformanceService.getMonthlyReturns(seriesNumber).then((returns) => {
      let stdev = PerformanceService.calculateStandardDeviation(returns)
      let maxmin = PerformanceService.getMaxMinReturns(returns)
      res.send({
        stdev: stdev,
        best: maxmin.max,
        worst: maxmin.min
      })
    })
  }

  this.getFacts = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    let result = {}
    async.waterfall([
      function(cb) {
        PerformanceService.getMonthlyData(seriesNumber).then((allMonthlyData) => {
          let monthlyReturns = PerformanceService.calcMonthlyReturns(allMonthlyData)
          let latestMonthlyReturn = monthlyReturns.pop()
          if (!latestMonthlyReturn) {
            return cb()
          }
          result.lastMonthReturn = latestMonthlyReturn.growth

          let allCumulativeReturns = PerformanceService.calcCumulativeReturns(allMonthlyData)
          result.totalReturn = allCumulativeReturns.pop().cumulativeGrowth

          let currentYearMonthlyData = _.filter(allMonthlyData, (monthlyData) => {
            return moment().startOf('year').isBefore(monthlyData)
          })
          let currentYearCumulativeReturns = PerformanceService.calcCumulativeReturns(currentYearMonthlyData)
          result.yearToDateReturn = currentYearCumulativeReturns.pop().cumulativeGrowth
          cb()
        })
      },
      function(cb) {
        PerformanceService.getMaxPriceHistory(seriesNumber).then((max) => {
          if (!max) {
            return cb()
          }
          result.highWaterMark = max.nav_per_unit
          cb()
        })
      },
      function(cb) {
        PerformanceService.calcDistributions(seriesNumber).then((total) => {
          if (!total) {
            return cb()
          }
          result.totalReturnWithDistribution = result.totalReturn + total
          cb()
        })
      }
    ], () => {
      res.send(result)
    })

  }

  return this
}
