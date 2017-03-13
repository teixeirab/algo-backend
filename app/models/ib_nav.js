/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('ib_nav', {
    period: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    account_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    base_currency: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cash: {
      type: "DOUBLE",
      allowNull: true
    },
    cash_collateral: {
      type: "DOUBLE",
      allowNull: true
    },
    stocks: {
      type: "DOUBLE",
      allowNull: true
    },
    securities_borrowed: {
      type: "DOUBLE",
      allowNull: true
    },
    securities_lent: {
      type: "DOUBLE",
      allowNull: true
    },
    options: {
      type: "DOUBLE",
      allowNull: true
    },
    bonds: {
      type: "DOUBLE",
      allowNull: true
    },
    commodities: {
      type: "DOUBLE",
      allowNull: true
    },
    funds: {
      type: "DOUBLE",
      allowNull: true
    },
    notes: {
      type: "DOUBLE",
      allowNull: true
    },
    accruals: {
      type: "DOUBLE",
      allowNull: true
    },
    dividend_accruals: {
      type: "DOUBLE",
      allowNull: true
    },
    soft_dollars: {
      type: "DOUBLE",
      allowNull: true
    },
    totals: {
      type: "DOUBLE",
      allowNull: true
    },
    twr: {
      type: "DOUBLE",
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'ib_nav'
  });
};
