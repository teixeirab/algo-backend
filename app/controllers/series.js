'use strict'
const async = require('async')
const moment = require('moment')
const _ = require('lodash')

module.exports = function(PerformanceService, LoanService, SeriesProductInformationModel, QBTransactionListModel) {
  const that = this

  this.checkExists = function(req, res, next, seriesNumber) {
    SeriesProductInformationModel.findOne({
      where: {
        series_number: seriesNumber
      }
    }).then((productInfo) => {
      if (!productInfo) {
        return res.status(404).send({msg: 'no series product info found'})
      }
      next()
    })
  }

  this.getHistoryPerformance = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    async.waterfall([
      function(cb) {
        PerformanceService
          .getMonthlyData(seriesNumber)
          .then((monthlyData) => {
            if (monthlyData.length === 0) {
              return cb({msg: 'no monthly reports found'})
            }
            cb(undefined, monthlyData)
          })
          .catch((e) => {
            cb(e)
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
      if (err) {
        return res.status(403).send(err)
      }
      res.send(monthlyReturns)
    })
  }

  this.getRiskData = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    PerformanceService.getMonthlyReturns(seriesNumber).then((returns) => {
      if (returns.length === 0) {
        return cb({msg: 'no monthly returns found'})
      }
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
          if (allMonthlyData.length === 0) {
            return cb({msg: 'no monthly reports found'})
          }
          let monthlyReturns = PerformanceService.calcMonthlyReturns(allMonthlyData)
          let latestMonthlyReturn = monthlyReturns.pop()
          if (!latestMonthlyReturn) {
            return cb()
          }
          result.lastMonthReturn = latestMonthlyReturn.monthlyReturn

          let allCumulativeReturns = PerformanceService.calcCumulativeReturns(allMonthlyData)
          result.totalReturn = allCumulativeReturns.pop().cumulativeReturn

          let currentYearMonthlyData = _.filter(allMonthlyData, (monthlyData) => {
            return moment().startOf('year').isBefore(monthlyData.period)
          })
          if(currentYearMonthlyData.length > 1) {
            let currentYearCumulativeReturns = PerformanceService.calcCumulativeReturns(currentYearMonthlyData)
            result.yearToDateReturn = currentYearCumulativeReturns.pop().cumulativeReturn
          }
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
          result.totalReturnWithDistribution = result.totalReturn + total
          cb()
        }).catch((e) => {
          cb(e)
        })
      }
    ], (err) => {
      if (err) {
        return res.status(403).send(err)
      }
      res.send(result)
    })
  }

  this.getLoanInfo = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    LoanService.getLoanInfo(seriesNumber).then((result) => {
      res.send(result)
    })
  }

  this.getInvoicesByCompany = function(req, res) {
    const company = req.params.company
    QBTransactionListModel.findAll({
      where: {
        qb_account: company,
        txn_type: 'Invoice'
      }
    }).then((invoices) => {
      res.send(invoices)
    })
  }

  return this
}
