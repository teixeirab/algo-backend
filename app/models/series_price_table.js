/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('series_price_table', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    last_loan_payment_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    settlement_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    nav: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    special_dates: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'series_price_table'
  });
};
