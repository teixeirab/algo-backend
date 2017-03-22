/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('borrowers', {
    company_name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    series_number: {
      type: Sequelize.INTEGER(11),
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
