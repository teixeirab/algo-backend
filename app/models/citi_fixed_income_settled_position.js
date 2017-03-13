/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('citi_fixed_income_settled_position', {
    account_id: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    as_of_date: {
      type: Sequelize.DATE,
      allowNull: true,
      primaryKey: true
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
      primaryKey: true
    },
    maturity_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    sec_id_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sec_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    issue_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    how_position_is_held: {
      type: Sequelize.STRING,
      allowNull: true
    },
    settled_quantity: {
      type: "DOUBLE",
      allowNull: true
    },
    interest_rate: {
      type: "DOUBLE",
      allowNull: true
    },
    current_face_value: {
      type: "DOUBLE",
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'citi_fixed_income_settled_position'
  });
};
