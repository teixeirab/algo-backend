/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('theorem_balance_sheet', {
    period: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.ENUM('Weekly','Monthly'),
      allowNull: false
    },
    total_assets: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    total_liabilities: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    total_equity: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    number_of_units_held: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    nav_per_unit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    operating_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    management_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    accounts_receivable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    interest_receivable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    investments_long: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    debt_instruments: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    cash: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    accrued_premium: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    other_assets: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    annual_series_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    arranger_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    audit_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    inventory_costs_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    price_dissemination_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    transfer_agent_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    trustee_agent_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    external_expense_offset_accrued: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    extraordinary_expenses_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    manager_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    administrator_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    performance_fee_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    portfolio_manager_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    arranger_fee_credit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    expenses_offset_credit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    legal_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    listing_agent_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    setup_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    transaction_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    accounting_fees_payable: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'theorem_balance_sheet'
  });
};
