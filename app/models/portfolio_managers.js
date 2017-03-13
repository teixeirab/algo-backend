/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('portfolio_managers', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    company_name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
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
    city: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    state: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    country: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    zipcode: {
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
