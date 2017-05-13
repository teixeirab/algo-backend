module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_customer', {
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
    display_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    given_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    middle_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    family_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fully_qualified_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    print_on_check_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bill_addr_line1: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bill_addr_city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bill_addr_country_sub_division_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bill_addr_postal_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    currency_code: {
      type: Sequelize.STRING(3)
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
    tableName: 'qb_customer'
  });

  return model
};
