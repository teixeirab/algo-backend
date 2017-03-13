/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_holidays', {
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    holiday: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'advances_holidays'
  });
};
