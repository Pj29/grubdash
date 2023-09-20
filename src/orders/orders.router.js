const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/") // define route for root /orders URL
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:orderId") // define route for URL with orderId parameter
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
