/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('series_agent_information', {
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true
    },
    issuer: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    calculation_agent: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    arranger: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    administrator: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    custodian: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    bd_of_record: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    sale_agent: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    placing_agent: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    portfolio_manager: {
      type: Sequelize.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'series_agent_information'
  });
};
