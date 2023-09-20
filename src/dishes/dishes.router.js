const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:dishId") // define route for URLs with a dishId paramater
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/") // define route for root /dishes URL
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
