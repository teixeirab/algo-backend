/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('pershing_trades', {
    account: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    cusip: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    trade_date: {
      type: Sequelize.DATE,
      allowNull: true,
      primaryKey: true
    },
    net_amount: {
      type: "DOUBLE",
      allowNull: false,
      primaryKey: true
    },
    price: {
      type: "DOUBLE",
      allowNull: false,
      primaryKey: true
    },
    account_nickname: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    security_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    settlement_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    quantity: {
      type: "DOUBLE",
      allowNull: true
    },
    price: {
      type: "DOUBLE",
      allowNull: true
    },
    principal: {
      type: "DOUBLE",
      allowNull: true
    },
    commission_fees: {
      type: "DOUBLE",
      allowNull: true
    },
    account_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    details: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'pershing_trades'
  });
};
