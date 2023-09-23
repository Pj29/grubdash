const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

// CRUDL functions //

function create(req, res) {
  const newOrder = { ...res.locals.order, id: nextId() };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res) {
  const { orderId } = req.params;
  const { data } = req.body;
  const updatedOrder = { ...data, id: orderId };
  res.json({ data: updatedOrder });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  if (index === -1) {
    return next({ status: 404, message: `Order ${orderId} not found.` });
  }

  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending.",
    });
  }

  orders.splice(index, 1);
  res.sendStatus(204);
}

function list(req, res) {
  res.json({ data: orders });
}

// Validation Middleware //

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    next();
  } else {
    next({ status: 404, message: `Order ${orderId} not found.` });
  }
}

function isIdValid(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;

  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }

  next();
}

function isStatusValid(req, res, next) {
  const validStatuses = [
    "pending",
    "preparing",
    "out-for-delivery",
    "delivered",
  ];
  const { data: { status } = {} } = req.body;

  if (!validStatuses.includes(status)) {
    return next({ status: 400, message: "Order must have a valid status." });
  }

  if (status === "delivered") {
    return next({
      status: 400,
      message: "A delivered order cannot be changed.",
    });
  }

  next();
}

function validateCreate(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;

  if (!deliverTo)
    return next({ status: 400, message: "Order must include a deliverTo." });
  if (!mobileNumber)
    return next({ status: 400, message: "Order must include a mobileNumber." });
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish.",
    });
  }

  dishes.forEach((dish, index) => {
    if (
      !dish.quantity ||
      !Number.isInteger(dish.quantity) ||
      dish.quantity <= 0
    ) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0.`,
      });
    }
  });

  res.locals.order = req.body.data;
  next();
}

module.exports = {
  list,
  create: [validateCreate, create],
  read: [orderExists, read],
  update: [orderExists, validateCreate, isIdValid, isStatusValid, update],
  destroy: [orderExists, destroy],
};
