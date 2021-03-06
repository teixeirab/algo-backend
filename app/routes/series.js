'use strict'

module.exports = function(app, UserController, SeriesController) {
  app.param('seriesNumber', SeriesController.checkExists)
  app.route("/api/panel/performance/:seriesNumber").get(UserController.internalAuth, SeriesController.getHistoryPerformance)
  app.route("/api/panel/risk/:seriesNumber").get(UserController.internalAuth, SeriesController.getRiskData)
  app.route("/api/panel/facts/:seriesNumber").get(UserController.internalAuth, SeriesController.getFacts)
  app.route("/api/panel/loansData/:seriesNumber").get(UserController.internalAuth, SeriesController.getLoanInfo)
  app.route("/api/panel/invoices/:company").get(UserController.internalAuth, SeriesController.getInvoicesByCompany)

  return this
}
