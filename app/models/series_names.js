'use strict'

const _ = require('lodash')

module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('series_names', {
    isin: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    common_code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    series_name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    series_short_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    six_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('A','D'),
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'series_names'
  })

  model.assignSeriesNumber = function(rows) {
    rows = Array.isArray(rows) ? rows : [rows]
    return this.findAll().then((seriesNames) => {
      rows.forEach((row) => {
        const matched = _.find(seriesNames, (sn) => {
          return sn.isin === row.isin
        })
        if(matched) {
          row.setDataValue('series_number', matched.series_number)
        }
      })
    })
  }
  return model
}
