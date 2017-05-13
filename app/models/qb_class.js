module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_class', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    qb_account: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    series_number: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fully_qualified_name: {
      type: Sequelize.STRING,
      allowNull: false
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
    tableName: 'qb_class'
  });

  return model
};
