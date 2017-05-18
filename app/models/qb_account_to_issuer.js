module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_account_to_issuer', {
    qb_account: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    issuer: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'qb_account_to_issuer'
  });

  return model
};
