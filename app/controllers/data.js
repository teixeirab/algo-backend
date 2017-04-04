module.exports = function(CommonService, SqlService) {

  this.findAll = function(req, res) {
    const table = req.params.table;
    CommonService.find(table).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.findOne = function(req, res) {
    const table = req.params.table;
    const id = req.params.id;
    const pk = req.params.pk;
    const whereOpts = {}
    whereOpts[pk] = id
    CommonService.find(table, whereOpts).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.deleteOne = function(req, res){
    const table = req.params.table
    const id = req.params.id
    const pk = req.params.pk
    CommonService.delete(table, pk, id).then(() => {
      res.status(200).send()
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.addOne = function(req, res) {
    const table = req.params.table
    const row = req.body
    CommonService.add(table, [row]).then((rows) => {
      res.send(rows[0])
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.editOne = function(req, res) {
    const row = req.body;
    const table = req.params.table;
    const pk = req.params.pk;
    const id = req.params.id;
    CommonService.update(table, pk, id, row).then((row) => {
      res.send(row)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.findFields = function(req, res) {
    const table = req.params.table;
    SqlService.findFields(table).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.findInfo = function(req, res) {
    const table = req.params.table;
    SqlService.findInfo(table).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      console.log(err)
      res.status(400).send(err)
    })
  }

  this.viewData = function(req, res) {
    const query = req.params.query;
    const param = req.params.param;
    SqlService.viewData(query, param).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.findOptions = function(req, res) {
    const table = req.params.table;
    const selectType = req.params.selectType;
    const query_name = req.params.query_name;
    SqlService.findOptions(table, selectType, query_name).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  this.getPrice = function(req, res) {
    const series_number = req.params.series_number;
    const settlement_date = req.params.settlement_date;
    SqlService.getPrice(series_number, settlement_date).then((rows) => {
      res.send(rows)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }

  return this
}
