'use strict'

module.exports = function(app, PerformanceController) {
  app.route("/api/panel/performance/:seriesNumber").get(PerformanceController.getHistoryPerformance)
  app.route("/api/panel/risk/:seriesNumber").get(PerformanceController.getRiskData)
  app.route("/api/panel/facts/:seriesNumber").get(PerformanceController.getFacts)

  return this
}
