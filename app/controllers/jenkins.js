'use strict'
const crypto = require('crypto')
const moment = require('moment')
const async = require('async')
const _ = require('lodash')

module.exports = function(Configs, JenkinsService) {
  const that = this

  this.calcMaintenanceFees = function(req, res) {
    req.checkBody({
      from: {
        notEmpty: true,
        errorMessage: 'Invalid from param'
      },
      to: {
        notEmpty: true,
        errorMessage: 'Invalid to param'
      }
    })
    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.status(403).send({err: result.array()})
      }
      const params = req.body
      JenkinsService.triggerJenkinsBuild({
        jobName: 'qb_invoices_maintenance',
        buildParams: {
          from: moment(params.from).format('YYYY-MM-DD'),
          to: moment(params.to).format('YYYY-MM-DD')
        }
      }).then((result) => {
        res.send(result)
      }).catch((err) => {
        res.status(403).send(err)
      })
    });
  }

  return this
}
