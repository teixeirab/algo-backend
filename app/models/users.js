/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize, Configs, Utils, MailService) {
  return FlexFundsDB.define('users', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_type: {
      type: Sequelize.ENUM('Trading','Operations','Accounting','Management','Admin', 'Theorem'),
      allowNull: false,
      defaultValue: "Trading"
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cell_phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    apikey: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('A','D'),
      allowNull: false,
      defaultValue: "D"
    },
    last_access: {
      type: Sequelize.DATE,
      allowNull: true
    },
    dt_joined: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    }
  }, {
    tableName: 'users',
    hooks: {
      beforeValidate: function(instance, options, fn) {
        if (!instance.password) {
          instance.password = Utils.hashPassword('flexfunds')
        }
        fn(undefined, instance)
      },
      afterCreate: function(instance, options, fn) {
        MailService.sendMail({
          to: instance.email,
          subject: 'Your FlexFunds account has been created',
          html: `Hello,<br> You can access to ` +
                `<a href="${Configs.frontUrl}">control panel</a> with following credentials:<br>` +
                ` username: <b>${instance.email}</b><br>password: <b>flexfunds</b>`
        })
        fn(undefined, instance)
      }
    }
  });
};
