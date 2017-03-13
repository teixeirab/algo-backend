'use strict'
const Promise = require('bluebird')
const _ = require('lodash')
const async = require('async')

module.exports = function(app, DependConfigs) {

  this.getModel = function(table) {
    const modelName = _.find(Object.keys(DependConfigs.dependency), (key) => {
      const value = DependConfigs.dependency[key]
      if(value.indexOf(table) > -1) {
        return true
      }
      return false
    })
    return app.summon.get(modelName)
  }

  this.find = function(table, where) {
    const model = this.getModel(table)
    let opts = {where: {}}
    if (where) {
      opts.where = where
    }
    return model.findAll(opts)
  }

  this.add = function(table, rows) {
    const deferred = Promise.pending()
    const model = this.getModel(table)
    let createdRows = []
    async.eachSeries(rows, (row, cb) => {
      model.create(row).then((row) => {
        createdRows.push(row)
        cb()
      })
    }, () => {
      deferred.resolve(createdRows)
    })
    return deferred.promise
  }

  this.delete = function(table, pk, value) {
    const model = this.getModel(table)
    let opts = {where: {}}
    opts.where[pk] = value
    return model.findOne(opts).then((obj) => {
      return obj.destroy()
    })
  }

  this.update = function(table, pk, value, row) {
    const model = this.getModel(table)
    let opts = {where: {}}
    opts.where[pk] = value
    return model.findOne(opts).then((obj) => {
      return obj.update(row)
    })
  }

  return this
}
