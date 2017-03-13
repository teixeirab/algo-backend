/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('performance_weekly', {
    id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    period: {
      type: Sequelize.DATE,
      allowNull: true
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    current_nav: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    month_performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    cummulative_performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    ytd_performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    standard_deviation: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    best_month_performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    worst_month_performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    drawdown_count: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    expense_ratio: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    high_water_mark: {
      type: Sequelize.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'performance_weekly'
  });
};
