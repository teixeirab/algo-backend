/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('advances_info', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.ENUM('Initial','Transaction','Transaction-1'),
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
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
    nominal_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    interest_rate: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    coupon_frequency: {
      type: Sequelize.ENUM('D','M','Q','S','Y'),
      allowNull: false
    },
    coupon_type: {
      type: Sequelize.ENUM('simple','compound','floating'),
      allowNull: false
    },
    day_count_convention: {
      type: Sequelize.ENUM('360','365','actual'),
      allowNull: false
    },
    interest_payment_type: {
      type: Sequelize.ENUM('C','R'),
      allowNull: true
    },
    repayment_type: {
      type: Sequelize.ENUM('B','N','A'),
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
