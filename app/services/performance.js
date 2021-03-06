'use strict';
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')

module.exports = function(TheoremBalanceSheetModel,
                          TheoremIncomeStatementModel,
                          SeriesProductInformationModel) {

  let that = this

  this.getMonthlyData = function(seriesNumber) {
    const deferred = Promise.pending()
    SeriesProductInformationModel.findOne({
      where: {
        series_number: seriesNumber
      }
    }).then((productInfo) => {
      if (!productInfo) {
        return deferred.reject({msg: 'no series product info found'})
      }
      TheoremBalanceSheetModel.findAll({
        where: {
          series_number: seriesNumber,
          type: productInfo.nav_frequency,
          nav_per_unit: {
            gt: 0
          }
        }
      }).then((data) => {
        deferred.resolve(data)
      })
    })
    return deferred.promise
  }

  this.getMonthlyReturns = function(seriesNumber) {
    const deferred = Promise.pending()
    this.getMonthlyData(seriesNumber).then((data) => {
      let returns = that.calcMonthlyReturns(data)
      deferred.resolve(returns)
    })
    return deferred.promise
  }

  this.calcMonthlyReturns = function(monthlyData) {
    monthlyData.sort((a, b) => {
      return a.period - b.period
    })
    let returns = []
    let isWeekly = monthlyData.length > 0 && monthlyData[0].type === 'Weekly'
    for (let i = 0; i < monthlyData.length; i++) {
      if (i === 0){
        returns.push({
          period: monthlyData[i].period,
          price: monthlyData[i].nav_per_unit,
          monthlyReturn: 0
        })
        continue
      }
      let lastMonthReport = monthlyData[i - 1]
      if (isWeekly) {
        lastMonthReport = this.getLastMonthReportByCurrentWeek(monthlyData, monthlyData[i])
      }
      let growth = monthlyData[i].nav_per_unit / lastMonthReport.nav_per_unit - 1
      returns.push({
        period: monthlyData[i].period,
        price: monthlyData[i].nav_per_unit,
        monthlyReturn: Math.round(growth * 100000) / 100000
      })
    }
    return returns
  }

  this.calcCumulativeReturns = function(monthlyData) {
    monthlyData.sort((a, b) => {
      return a.period - b.period
    })
    let returns = []
    let firstNav = monthlyData[0].nav_per_unit
    for (let i = 0; i < monthlyData.length; i++) {
      if (i === 0){
        returns.push({
          period: monthlyData[i].period,
          price: monthlyData[i].nav_per_unit,
          cumulativeReturn: 0
        })
        continue
      }
      let growth = monthlyData[i].nav_per_unit / firstNav - 1
      returns.push({
        period: monthlyData[i].period,
        price: monthlyData[i].nav_per_unit,
        cumulativeReturn: Math.round(growth * 100000) / 100000
      })
    }
    return returns
  }

  this.getLastMonthReportByCurrentWeek = function(weeks, currentWeek) {
    let lastMonth = moment(currentWeek.period).subtract(1, 'month')
    weeks = _.filter(weeks, (week) => {
      return moment(week.period).isAfter(moment(lastMonth).subtract(6, 'day')) &&
             moment(week.period).isBefore(moment(lastMonth).add(6, 'day')) &&
             moment(week.period).isBefore(moment(currentWeek).startOf('month'))
    })
    if (weeks.length === 0) {
      return currentWeek
    }
    weeks.sort((a, b) => {
      let atime = a.period.getTime()
      let btime = b.period.getTime()
      let lastMonthTime = lastMonth.toDate().getTime()
      return Math.abs(atime - lastMonthTime) - Math.abs(btime - lastMonthTime)
    })
    let lastMonthWeek = weeks[0]
    return lastMonthWeek
  }

  this.calculateStandardDeviation = function(monthlyReturns) {
    let count = monthlyReturns.length
    let mean = _.sumBy(monthlyReturns, (ret) => {
      return ret.monthlyReturn
    }) / count
    let errorSum = _.sumBy(monthlyReturns, (ret) => {
      return Math.pow(ret.monthlyReturn - mean, 2)
    })
    return Math.sqrt(errorSum / count)
  }

  this.getMaxMinReturns = function(monthlyReturns) {
    monthlyReturns.sort((a, b) => {
      return a.monthlyReturn - b.monthlyReturn
    })
    return {max: monthlyReturns[monthlyReturns.length - 1], min: monthlyReturns[0]}
  }

  this.getMaxPriceHistory = function(seriesNumber) {
    const deferred = Promise.pending()
    TheoremBalanceSheetModel.findAll({
      where:{
        series_number: seriesNumber
      }
    }).then((data) => {
      data.sort((a, b) => {
        return b.nav_per_unit - a.nav_per_unit
      })
      deferred.resolve(data[0])
    })
    return deferred.promise
  }

  this.calcDistributions = function(seriesNumber) {
    const deferred = Promise.pending()
    TheoremBalanceSheetModel.findOne({
      where: {
        series_number: seriesNumber
      },
      orderBy: 'period desc'
    }).then((balanceSheet) => {
      if (!balanceSheet) {
        return deferred.reject({msg: 'no balance sheet found'})
      }
      TheoremIncomeStatementModel.findAll({
        where: {
          series_number: seriesNumber
        }
      }).then((incomes) => {
        let total = _.sumBy(incomes, (income) => {
          return income.dividend + income.loan_interest_income_received
        })
        deferred.resolve(total / balanceSheet.number_of_units_held)
      })
    })
    return deferred.promise
  }

  return this
}
