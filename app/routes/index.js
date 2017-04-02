'use strict'

module.exports = function(app, DataController, UserController) {
  app.route("/api/panel/login").post(UserController.login);
  app.route("/api/panel/user")
    .get(UserController.auth, UserController.getUser)
    .put(UserController.auth, UserController.updateProfile)
  app.route("/api/panel/reset-password")
    .post(UserController.resetPassword)
    .put(UserController.auth, UserController.changePassword)
  app.route("/api/panel/sql/:table").get(UserController.auth, DataController.findAll);
  app.route("/api/panel/sql/:table/:id/:pk").get(UserController.auth, DataController.findOne);
  app.route("/api/panel/sql/fields/:table").get(UserController.auth, DataController.findFields);
  app.route("/api/panel/sql/info/:table").get(UserController.auth, DataController.findInfo);
  app.route("/api/panel/view/:query/:param").get(UserController.auth, DataController.viewData);
  app.route("/api/panel/sql/delete/:table/:id/:pk").get(UserController.auth, DataController.deleteOne);
  app.route("/api/panel/sql/:table").post(UserController.auth, DataController.addOne);
  app.route("/api/panel/sql/:table/:pk/:id").put(UserController.auth, DataController.editOne);
  app.route("/api/panel/options/:selectType/:table/:query_name").get(UserController.auth, DataController.findOptions);
  app.route("/api/prices/:series_number/:settlement_date").get(DataController.getPrice);

  return this
}
