/* jshint indent: 2 */
module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_schedule', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
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
    previous_payment_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'advances_schedule'
  });
};
