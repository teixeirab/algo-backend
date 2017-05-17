/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('qb_invoices_maintenance', {
    series_number: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    from: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    to: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    audit_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    price_dissemination_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    transfer_agent_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    arranger_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    administrator_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    inventory_cost: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    listing_agent_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    transaction_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    annual_series_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    operating_fees_credit: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    expenses_credit: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    external_expenses_credit: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    portfolio_manager_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    bank_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    performance_fee: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    premium_discount_paid: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    },
    accounting_fees: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0
    },
    invoice_sent_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'qb_invoices_maintenance'
  });
};
