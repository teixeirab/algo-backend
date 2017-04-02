'use strict'
const Promise = require('bluebird')
const _ = require('lodash')
const async = require('async')
const fs = require('fs')

module.exports = function(FlexFundsDB) {
  const type_list = ['citi_unsettled_transactions', 'citi_all_transactions', 'citi_available_position'];

  require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  this.findFields = function(table) {
    let query = "";
    if (type_list.indexOf(table) > -1){
      query = "SELECT column_name, column_type, is_nullable, column_comment, column_key from INFORMATION_SCHEMA.COLUMNS where table_name = 'series_names' and column_name = 'series_number'" +
              " Union " +
              `SELECT column_name, column_type, is_nullable, column_comment, column_key from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}' and table_schema = '${FlexFundsDB.config.database}';`;
    } else query =`SELECT column_name, column_type, is_nullable, column_comment, column_key from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}' and table_schema = '${FlexFundsDB.config.database}';`;
    return FlexFundsDB.query(query, { type: FlexFundsDB.QueryTypes.SELECT })
  }

  this.findInfo = function(table) {
      var query = `SELECT table_comment from INFORMATION_SCHEMA.tables where table_name = '${table}' and table_schema = '${FlexFundsDB.config.database}';`;
      return FlexFundsDB.query(query, { type: FlexFundsDB.QueryTypes.SELECT })
  }

  this.findOptions = function(table, selectType, query_name) {
    var query = '';

    if(query_name == 'trades_view'){
      query = 'select distinct(concat(t0.series_number, " - ", isin, " - ", six_name)) label, t0.series_number value from '
          + table +  ' t0, series_names t1 where t0.series_number = t1.series_number and t0.product_type = "Fund" order by value asc;';
    }

    else if(query_name == 'reporting_series_view'){
      query = 'select distinct(period) as label, period as value from theorem_balance_sheet where type= "Monthly" order by value desc;'
    }

    else if (selectType == 'series_number'){
      query = 'select distinct(concat(t0.series_number, " - ", isin, " - ", six_name)) label, t0.series_number value from '
        + table +  ' t0, series_names t1 where t0.series_number = t1.series_number order by value asc;';
    }

    else if (selectType == 'isin'){
      query = 'select distinct(concat(series_number, " - ", t0.isin, " - ", six_name)) label, t0.isin value from '
          + table +  ' t0, series_names t1 where t0.isin = t1.isin order by value asc;';
    }
    else {
      query = 'select distinct(' + selectType + ') label, ' + selectType +' value from ' + table + ' order by ' + selectType + ' asc;';
    }
    return FlexFundsDB.query(query, { type: FlexFundsDB.QueryTypes.SELECT })
  }

  this.getPrice = function(series_number, settlement_date){
    var query = require("../models/queries/prices.txt");

    query = replaceAll(query, "{param0}", series_number);
    query = replaceAll(query, "{param1}", settlement_date);
    query = replaceAll(query, '{param2}', settlement_date.replace('-', '').replace('-', '').substring(0,6));

    return FlexFundsDB.query(query, { type: FlexFundsDB.QueryTypes.SELECT })
  }

  this.viewData = function(query_name, param){
      var query = require("../models/queries/" + query_name +".txt");
      query = replaceAll(query, "{param0}", param);

      return FlexFundsDB.query(query, { type: FlexFundsDB.QueryTypes.SELECT })
  }

  return this
}
