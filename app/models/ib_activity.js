'use strict';
const moment = require('moment')

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('ib_activity', {
    trade_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    con_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    security_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bb_ticker: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bb_global_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    security_description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    asset_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    base_currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    trade_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    trade_time: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    settle_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    transaction_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    quantity: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    unit_price: {
      type: "DOUBLE",
      allowNull: true
    },
    gross_amount: {
      type: "DOUBLE",
      allowNull: true
    },
    sec_fee: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    commission: {
      type: "DOUBLE",
      allowNull: true
    },
    tax: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    net: {
      type: "DOUBLE",
      allowNull: true
    },
    net_in_base: {
      type: "DOUBLE",
      allowNull: true
    },
    tax_basis_election: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fx_rate_to_base: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    contraparty_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clr_firm_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: true
    },
    master_account_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    van: {
      type: Sequelize.STRING,
      allowNull: true
    },
    away_broker_commission: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    order_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'ib_activity',
    setterMethods: {
      trade_date: function(value) {
        this.setDataValue('trade_date', moment(value, 'YYYYMMDD').toDate())
      },
      settle_date: function(value) {
        this.setDataValue('settle_date', moment(value, 'YYYYMMDD').toDate())
      }
    }
  });
};
