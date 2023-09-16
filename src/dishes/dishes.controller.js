const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = { id: nextId(), name, description, price, image_url };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const { dishId } = req.params;
  const { data: { name, description, price, image_url, id } = {} } = req.body;

  const dish = dishes.find((dish) => dish.id === dishId);

  if (dish) {
    const updatedDish = { ...dish, name, description, price, image_url };
    if (id) {
      updatedDish.id = id;
    }
    Object.assign(dish, updatedDish);
    res.json({ data: dish });
  } else {
    next({ status: 404, message: `Dish ${dishId} not found.` });
  }
}

function list(req, res) {
  res.json({ data: dishes });
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({ status: 404, message: `Dish ${dishId} not found.` });
  }
}

function validateField(fieldName, errorMessage) {
  return (req, res, next) => {
    const value = req.body.data[fieldName];
    if (!value) {
      return next({
        status: 400,
        message: `Dish must include a ${fieldName}.`,
      });
    }
    next();
  };
}

const isNameValid = validateField("name", "Dish must include a name.");
const isDescriptionValid = validateField(
  "description",
  "Dish must include a description."
);
const isUrlValid = validateField(
  "image_url",
  "Dish must include an image_url."
);

function isPriceValid(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (
    !price ||
    typeof price !== "number" ||
    price <= 0 ||
    !Number.isInteger(price)
  ) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0.",
    });
  }
  next();
}

function isIdValid(req, res, next) {
  const { data: { id } = {} } = req.body;
  const dishId = req.params.dishId;
  if (id === undefined || id === null || id === "") {
    return next();
  }

  if (id === dishId) {
    return next();
  }

  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

module.exports = {
  list,
  create: [isNameValid, isDescriptionValid, isPriceValid, isUrlValid, create],
  read: [dishExists, read],
  update: [
    dishExists,
    isNameValid,
    isDescriptionValid,
    isPriceValid,
    isUrlValid,
    isIdValid,
    update,
  ],
};
