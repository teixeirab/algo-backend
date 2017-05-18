module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_to_theorem', {
    theorem_col: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    qb_item_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    qb_account: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'qb_to_theorem'
  });

  return model
};
