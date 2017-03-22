/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('portfolio_managers', {
    company_name: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    series_numbers: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    contact_name: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cellphone: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    address1: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    address2: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'portfolio_managers'
  });
};
