module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_item', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    qb_account: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    income_account_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    expense_account_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    asset_account_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
      allowNull: false
    }
  }, {
    tableName: 'qb_item'
  });

  return model
};
