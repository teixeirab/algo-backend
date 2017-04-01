'use strict'

module.exports = function(app, SeriesController) {
  app.param('seriesNumber', SeriesController.checkExists)
  app.route("/api/panel/performance/:seriesNumber").get(SeriesController.getHistoryPerformance)
  app.route("/api/panel/risk/:seriesNumber").get(SeriesController.getRiskData)
  app.route("/api/panel/facts/:seriesNumber").get(SeriesController.getFacts)
  app.route("/api/panel/loans/:seriesNumber").get(SeriesController.getLoanInfo)

  return this
}
