/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_repayments', {
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    repayment_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    repayment_date: {
      type: Sequelize.DATE,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'advances_repayments'
  });
};
