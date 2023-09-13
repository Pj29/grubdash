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
