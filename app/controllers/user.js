'use strict'
const crypto = require('crypto');
const moment = require('moment')

module.exports = function(UsersModel, Utils) {
  const that = this
  this.refreshAPIKey = function(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
  };

  this.login = function(req, res) {
    const username = req.body.username
    const password = req.body.password
    UsersModel.findOne({
      where: {
        email: username,
        password: Utils.hashPassword(password),
        status: 'A'
      }
    }).then((user) => {
      if(!user) {
        return res.status(401).send()
      }
      user.apikey = that.refreshAPIKey(username + password + new Date().toISOString())
      user.last_access = new Date()
      user.save().then((user) => {
        res.send(user)
      })
    })
  }

  this.auth = function(req, res, next) {
    console.log('test')
    const apikey = req.get('x-apikey')
    UsersModel.findOne({where: {apikey: apikey}}).then((user) => {
      if (!user) {
        return res.status(401).send()
      }
      if(moment().diff(user.last_access, 'minute') > 20) {
        return res.status(401).send()
      }
      user.last_access = new Date()
      user.save().then((user) => {
        req.user = user
        next()
      })
    })
  }

  this.getUser = function(req, res) {
    res.send(req.user)
  }

  this.resetPassword = function(req, res) {
    const email = req.body.email
    UsersModel.findOne({where: {email: email}}).then((user) => {
      crypto.randomBytes(5, (err, buffer) => {
        var token = buffer.toString('hex');
        console.log(token)
        user.password = Utils.hashPassword(token)
        user.save().then(() => {
          res.status(204).send()
        }).catch((e) => {
          console.log(e)
        })
      });
    })
  }

  this.updateProfile = function(req, res) {
    const fields = ['first_name', 'last_name', 'cell_phone', 'email']
    fields.forEach((field) => {
      req.user[field] = req.body[field]
    })
    req.user.save().then((user) => {
      res.send(user)
    })
  }

  this.changePassword = function(req, res) {
    const current = req.body.current
    const password = req.body.password
    if(!password || !current || req.user.password !== Utils.hashPassword(current)) {
      return res.status(403)
    }
    req.user.password = Utils.hashPassword(password)
    req.user.save().then(() => {
      res.status(200).send()
    })
  }

  return this
}
