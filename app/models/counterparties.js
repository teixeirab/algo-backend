/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('counterparties', {
    counterparty_key: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    person_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cellphone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address_1: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    address_2: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    custodian: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    euroclear_clearstream_account: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('A','D'),
      allowNull: false
    }
  }, {
    tableName: 'counterparties'
  });
};
