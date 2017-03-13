/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_repayments', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    info_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    repayment_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    repayment_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    tableName: 'advances_repayments'
  });
};
