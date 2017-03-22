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
      allowNull: false
    },
    first_interest_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    maturity_date: {
      type: Sequelize.DATE,
      allowNull: false
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
      allowNull: true
    },
    simple_coupon_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: true
    },
    compounded_interest_rate: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    compounded_coupon_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: true
    },
    compounded_frequency: {
      type: Sequelize.ENUM('Daily','Monthly','Quarterly','Semi-Annually','Yearly'),
      allowNull: true
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
