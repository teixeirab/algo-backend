var moment = require('moment');
var async = require('async');

var Helper = function() {
    this.createInstances = function(type, values, callback) {
        var model = app.summon.get(type);
        async.each(values, function(value, cb){
            model.create(value).then(function(d){
                cb();
            }).catch(function(e){
                console.log(e);
            });
        }, callback);
    };

    this.batchCreateInstances = function(dataList, callback) {
        var that = this;
        async.each(dataList, function(data, cb){
            that.createInstances(data[0], data[1], function(){
                cb();
            })
        }, callback);
    };

    this.cleanDB = function(dbs, callback) {
        async.each(dbs, function(db, cb) {
            db.sync({
                logging: false,
                force: true
            }).then(function() {
                cb();
            });
        }, function() {
            callback();
        });
    };
};

module.exports = new Helper();
