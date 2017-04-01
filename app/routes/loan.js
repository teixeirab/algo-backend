'use strict'

module.exports = function(app, LoanController) {
  app.route("/api/panel/loans/:seriesNumber").get(LoanController.getLoanInfo)

  return this
}
