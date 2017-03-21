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
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    cellphone: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    address1: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    address2: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('A','D'),
      allowNull: false
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    tableName: 'portfolio_managers'
  });
};
