module.exports = function(Configs, Sequelize) {
  //database configs
  function getSequezlieParams (Configs, timestamps) {
    var params = {
      host: Configs.dbHost,
      port: Configs.port || 3306,
      dialect: Configs.dialect,
      logging: Configs.dbLogging,
      define: {
        timestamps: timestamps || false
      }
    };
    if(Configs.dialect === 'mysql') {
      params.timezone = '-05:00';
    }
    return params;
  };
  var params = getSequezlieParams(Configs, false);
  var flexFundsDB = new Sequelize(Configs.db, Configs.user, Configs.password, params);
  return flexFundsDB;
};
