/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cron_stats', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    source: {
      type: DataTypes.ENUM('Citi','IB','Theorem','Pershing'),
      allowNull: true
    },
    table_loc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: false
    },
    file_name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'cron_stats'
  });
};
