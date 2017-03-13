/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('series_agent_information', {
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true
    },
    'Calculation Agent': {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Arranger: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Administrator: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    Custodian: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    'BD of Record': {
      type: Sequelize.TEXT,
      allowNull: true
    },
    'Sale Agent': {
      type: Sequelize.TEXT,
      allowNull: true
    },
    'Placing Agent': {
      type: Sequelize.TEXT,
      allowNull: true
    },
    'Portfolio Manager': {
      type: Sequelize.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'series_agent_information'
  });
};
