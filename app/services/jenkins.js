'use strict';
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const request = require('request')
const async = require('async')

module.exports = function(Configs) {
  let that = this

  this.triggerJenkinsBuild = function(params) {
    let jobName = params.jobName
    let buildParams = params.buildParams
    let jobUrl = Configs.jenkins.url + `/job/${jobName}`
    let buildParamQuery = 'table=' + jobName
    Object.keys(buildParams).forEach((key) => {
      buildParamQuery += `&${key}=${buildParams[key]}`
    })
    let options = {
      url: jobUrl + `/buildWithParameters?${buildParamQuery}`,
      method: 'POST'
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if(err) {
          return reject(err)
        }
        let result
        async.retry({
          times: 10
        }, (cb) => {
          setTimeout(() => {
            request(`${jobUrl}/lastBuild/api/json`, (err, res, body) => {
              if (err) {
                return cb(err)
              }
              result = JSON.parse(body)
              cb(result.building)
            })
          }, 10000)
        }, () => {
          resolve(result)
        })
      })
    })
  }

  return this
}
