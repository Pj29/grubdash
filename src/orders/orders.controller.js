const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

function list(req, res, next) {
  res.json({ data: orders });
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.json({ data: foundOrder });
  } else {
    next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    });
  }
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }

  next({
    status: 404,
    message: `Order ID not found: ${orderId}`,
  });
}

function update(req, res, next) {
  const { orderId } = req.params;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  if (
    !deliverTo ||
    !mobileNumber ||
    !status ||
    !dishes ||
    !Array.isArray(dishes) ||
    dishes.length === 0
  ) {
    return next({
      status: 400,
      message: "Invalid data",
    });
  }

  const updatedOrder = {
    id: orderId,
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  const index = orders.findIndex((order) => order.id === orderId);
  orders[index] = updatedOrder;

  res.json({ data: updatedOrder });
}

function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  if (index > -1) {
    orders.splice(index, 1);
    res.sendStatus(204);
  } else {
    next({
      status: 404,
      message: `Order ID not found: ${orderId}`,
    });
  }
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};
