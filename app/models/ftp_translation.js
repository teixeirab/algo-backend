/* jshint indent: 2 */

module.exports = function(FlexFundsDB, Sequelize) {
  return FlexFundsDB.define('ftp_translation', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    database_field: {
      type: Sequelize.STRING,
      allowNull: false
    },
    report_field: {
      type: Sequelize.STRING,
      allowNull: false
    },
    source: {
      type: Sequelize.ENUM('Theorem','Citi','Interactive Brokers','Pershing'),
      allowNull: false
    },
    table_loc: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'ftp_translation'
  });
};
