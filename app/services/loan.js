'use strict';
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')

module.exports = function(SeriesNamesModel,
                          AdvancesInfoModel,
                          AdvancesRepaymentsModel,
                          CitiAllTransactionsModel) {
  let that = this

  this.getLoanInfo = function(seriesNumber) {
    const deferred = Promise.pending()
    let result = {}
    AdvancesInfoModel.findOne({
      where: {
        series_number: seriesNumber
      }
    }).then((advInfo) => {
      if (!advInfo) {
        return deferred.resolve()
      }
      result.first_interest_date = advInfo.first_interest_date
      result.maturity_date = advInfo.maturity_date
      result.day_count_convention = advInfo.day_count_convention
      result.interest_repayment_type = advInfo.interest_repayment_type
      result.interest_rate = advInfo.simple_interest_rate + advInfo.compounded_interest_rate
      result.coupon_frequency = advInfo.simple_coupon_frequency || advInfo.compounded_coupon_frequency
      SeriesNamesModel.findOne({
        where: {
          series_number: seriesNumber
        }
      }).then((seriesName) => {
        CitiAllTransactionsModel.findAll({
          where: {
            isin: seriesName.isin
          }
        }).then((txs) => {
          let quantitySum = _.sumBy(txs, (tx) => {
            if (['DVP', 'DF'].indexOf(tx.transaction_type) > -1) {
              return tx.quantity
            }
            if (tx.transaction_type === 'RVP') {
              return -tx.quantity
            }
            return 0
          })
          AdvancesRepaymentsModel.findAll({
            where: {
              series_number: seriesNumber
            }
          }).then((repayments) => {
            let repaymentSum = _.sumBy(repayments, (repay) => {
              return repay.repayment_amount
            }) || 0
            result.nominal_outstanding = quantitySum - repaymentSum
            deferred.resolve(result)
          })
        })
      })
    })
    return deferred.promise
  }

  return this
}
