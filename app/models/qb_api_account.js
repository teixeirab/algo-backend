module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_api_account', {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    account: {
      type: Sequelize.STRING,
      allowNull: false
    },
    consumer_key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    consumer_secret: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token_secret: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token_expires_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    realm_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    use_sandbox: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    debug: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'qb_api_account'
  });

  return model
};
