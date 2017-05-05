module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_invoice_type_item', {
    invoice_type: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    qb_account: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    item_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    item_amount: {
      type: Sequelize.STRING,
      allowNull: false
    },
    dt_added: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
      allowNull: false
    }
  }, {
    tableName: 'qb_invoice_type_item'
  });

  return model
};
