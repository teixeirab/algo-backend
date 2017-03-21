/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_info', {
    series_number: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      allowNull: false
    },
    interest_accrual_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    first_interest_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    maturity_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    day_count_convention: {
      type: Sequelize.ENUM('360','365','Actual'),
      allowNull: false
    },
    principal_repayment_type: {
      type: Sequelize.ENUM('Bullet','No Repayment','Amortized'),
      allowNull: false
    },
    simple_interest_rate: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    simple_coupon_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: false
    },
    compounded_interest_rate: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    compounded_coupon_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: false
    },
    compounded_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: false
    },
    price_table: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    tableName: 'advances_info'
  });
};
