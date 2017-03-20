/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('borrowers', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    contact_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cellphone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address_1: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address_2: {
      type: Sequelize.STRING,
      allowNull: true
    },
    percent_outstanding: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('A','D'),
      allowNull: true,
      defaultValue: "D"
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    }
  });
};
