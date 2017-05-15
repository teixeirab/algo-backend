'use strict'

module.exports = function(app, UserController, QBController) {
  app.route("/api/panel/qb/customer").post(UserController.internalAuth, QBController.createCustomer)
  app.route("/api/panel/qb/setup-invoice").post(UserController.internalAuth, QBController.generateSetUpInvoice)
  // app.route("/api/panel/qb/legal-invoice").post(UserController.internalAuth, QBController.generateLegalInvoice)

  return this
}
