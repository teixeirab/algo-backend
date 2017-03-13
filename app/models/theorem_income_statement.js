/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('theorem_income_statement', {
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
    loan_interest_income: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    loan_interest_income_received: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    dividend: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    portfolio_income: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    stcg: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    unrealized_gain: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    manager_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    audit_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    price_dissemination_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    trustee_corporate_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    transfer_agent_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    arranger_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    external_expense_offset: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    extraordinary_expense: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    administrator_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    inventory_cost: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    listing_agent_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    transaction_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    legal_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    annual_series_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    operating_fees_credit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    setup_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    expenses_credit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    external_expenses_credit: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    portfolio_manager_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    bank_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    performance_fee: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    premium_discount_paid: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    accounting_fees: {
      type: Sequelize.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'theorem_income_statement'
  });
};
