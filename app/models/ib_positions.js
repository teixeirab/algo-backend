/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('ib_positions', {
    account_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    con_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    report_date: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    type: {
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
    quantity: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    quantity_in_base: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    cost_price: {
      type: "DOUBLE",
      allowNull: true
    },
    cost_basis: {
      type: "DOUBLE",
      allowNull: true
    },
    cost_basis_in_base: {
      type: "DOUBLE",
      allowNull: true
    },
    market_price: {
      type: "DOUBLE",
      allowNull: true
    },
    market_value: {
      type: "DOUBLE",
      allowNull: true
    },
    market_value_in_base: {
      type: "DOUBLE",
      allowNull: true
    },
    open_date_time: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fx_rate_to_base: {
      type: "DOUBLE",
      allowNull: true
    },
    settled_quantity: {
      type: "DOUBLE",
      allowNull: true
    },
    settled_quantity_in_base: {
      type: "DOUBLE",
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
    accrued_int: {
      type: "DOUBLE",
      allowNull: true
    },
    originating_order_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'ib_positions'
  });
};
