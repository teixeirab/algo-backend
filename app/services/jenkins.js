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
    let token = Configs.jenkins.token
    let buildQueryString = ''
    Object.kesy(buildParams).forEach((key) => {
      buildQueryString += key + '=' + buildParams[key]
    })
    let jobUrl = Configs.jenkins.url + `/job/${jobName}`
    let options = {
      url: jobUrl + `/buildWithParameters?token=${token}&${buildQueryString}`,
      method: 'GET'
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if(err) {
          return reject(err)
        }
        let result
        async.doWhilst((cb) => {
          request(`${jobUrl}/lastBuild/api/json?token={token}`, (err, res, body) => {
            if (err) {
              return cb(err)
            }
            result = body
            cb()
          })
        }, (err) => {
          if(err) {
            return reject(err)
          }
          resolve(result)
        })
      })
    })
  }

  return this
}
