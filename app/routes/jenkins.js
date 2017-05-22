'use strict'

module.exports = function(app, UserController, JenkinsController) {
  app.route("/api/jenkins/maintenance-fees").post(UserController.auth, JenkinsController.calcMaintenanceFees)

  return this
}
