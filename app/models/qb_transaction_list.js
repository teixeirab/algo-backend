const moment = require('moment')
module.exports = function(FlexFundsDB, Sequelize) {
  let model = FlexFundsDB.define('qb_transaction_list', {
    qb_account: {
      type: Sequelize.STRING,
      allowNull: false
    },
    doc_num: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    tx_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    txn_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_no_post: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    create_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    create_by: {
      type: Sequelize.STRING,
      allowNull: true
    },
    last_mod_by: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    memo: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    other_account: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sales_cust1: {
      type: Sequelize.STRING,
      allowNull: true
    },
    pmt_mthd: {
      type: Sequelize.STRING,
      allowNull: true
    },
    term_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    due_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    cust_msg: {
      type: Sequelize.STRING,
      allowNull: true
    },
    inv_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_ap_paid: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_cleared: {
      type: Sequelize.STRING,
      allowNull: true
    },
    printed: {
      type: Sequelize.STRING,
      allowNull: true
    },
    subt_nat_home_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    nat_home_open_bal: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    exch_rate: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    subt_nat_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    home_tax_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    home_net_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    foreign_tax_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    foreign_net_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    nat_foreign_open_bal: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    nat_foreign_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    dt_added: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    tableName: 'qb_transaction_list',
    hooks: {
      beforeValidate: (instance) => {
        Object.keys(instance.dataValues).forEach((col) => {
          if (model.attributes[col] && model.attributes[col].type instanceof Sequelize.DOUBLE) {
            let val = parseFloat(instance[col])
            instance[col] = val ? val : null
          }
          if (model.attributes[col] && model.attributes[col].type instanceof Sequelize.DATE) {
            if (!moment(new Date(instance[col])).isValid()) {
              instance[col] = null
            }
          }
        })
      }
    }
  });

  return model
}
