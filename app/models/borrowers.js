/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('borrowers', {
    id: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    series_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contact_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cellphone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address1: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    address2: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    percent_outstanding: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'borrowers'
  });
};
