'use strict'

module.exports = function(LoanService) {
  this.getLoanInfo = function(req, res) {
    const seriesNumber = req.params.seriesNumber
    LoanService.getLoanInfo(seriesNumber).then((result) => {
      res.send(result)
    })
  }

  return this
}
