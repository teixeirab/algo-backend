/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_interest_payments', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    info_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    loan_payment_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    interest_determination_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    series_interest_payment_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    nominal_balance: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    interest_repayment: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    interest_receivable: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    interest_accrued: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    principal_repayment: {
      type: Sequelize.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'advances_interest_payments'
  });
};
