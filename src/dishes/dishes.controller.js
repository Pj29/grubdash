const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function list(req, res, next) {
  res.json({ data: dishes });
}

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.json({ data: foundDish });
  } else {
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  }
}

function update(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    const { data: { name, description, price, image_url } = {} } = req.body;

    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;

    res.json({ data: foundDish });
  } else {
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  }
}

function destroy(req, res, next) {
  const { dishId } = req.params;
  const index = dishes.findIndex((dish) => dish.id === dishId);

  if (index !== -1) {
    dishes.splice(index, 1);
    res.sendStatus(204);
  } else {
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  }
}
