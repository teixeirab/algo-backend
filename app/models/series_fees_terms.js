/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('series_fees_terms', {
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    operating_fees: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    administrator_fees: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    setup_fees: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    arranger_fee: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    portfolio_management_fee: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    performance_fee: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    special_condition: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    external_offset: {
      type: Sequelize.ENUM('Yes','No'),
      allowNull: true
    }
  }, {
    tableName: 'series_fees_terms'
  });
};
