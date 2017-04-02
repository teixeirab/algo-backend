/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('series_product_information', {
    series_number: {
      type: Sequelize.INTEGER(50),
      allowNull: false,
      primaryKey: true
    },
    bloomberg_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product_type: {
      type: Sequelize.ENUM('Fund','Wrapper','Loan','Hybrid'),
      allowNull: false
    },
    issue_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    maturity_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    region: {
      type: Sequelize.ENUM('South Cone','Andean & Caribbean','North America','Europe','Asia & ME','Africa'),
      allowNull: false
    },
    nav_frequency: {
      type: Sequelize.ENUM('Weekly','Monthly'),
      allowNull: false
    },
    currency: {
      type: Sequelize.ENUM('USD','EUR'),
      allowNull: false
    },
    custodian: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    portfolio_manager: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    initial_principal_amount: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    investment_strategy: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    valuation_frequency: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    shares: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type_of_subscription: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'series_product_information'
  });
};
