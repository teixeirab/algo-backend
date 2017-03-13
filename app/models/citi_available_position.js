/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize, SeriesNamesModel) {
  return FlexFundsDB.define('citi_available_position', {
    period: {
      type: Sequelize.DATE,
      allowNull: true,
      primaryKey: true
    },
    account_id: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    iso_country_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    branch_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    issue_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    settled_position: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    confirmed_delivers: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    confirmed_receives: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    unconfirmed_delivers: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    unconfirmed_receives: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    blocked_position: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    available_position: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    additional_informaiton: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    blocked_to_delivery: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'citi_available_position',
    hooks: {
      afterFind: function(rows, options) {
        SeriesNamesModel.assignSeriesNumber(rows)
      }
    }
  })
};
