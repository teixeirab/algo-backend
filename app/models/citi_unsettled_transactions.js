'use strict'
const async = require('async')
const Promise = require('bluebird')
const _ = require('lodash')
module.exports = function(FlexFundsDB, Sequelize, SeriesNamesModel) {
   const model = FlexFundsDB.define('citi_unsettled_transactions', {
    client_reference: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    settlement_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    txn_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    custodian_reference: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sec_id_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sec_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true
    },
    issue_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    quantity: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    settled_quantity: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    settlement_amount: {
      type: "DOUBLE",
      allowNull: true
    },
    trade_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    counterparty_ec: {
      type: Sequelize.STRING,
      allowNull: true
    },
    counterparty_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    legal_confirm: {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'citi_unsettled_transactions',
    hooks: {
      afterFind: function(rows, options) {
        return SeriesNamesModel.assignSeriesNumber(rows)
      }
    }
  });
  return model
};
