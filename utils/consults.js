const Brand = require("../models/brand");
const Model = require("../models/model");
const Category = require("../models/category");
const Vehicle = require("../models/vehicle");
const { consoleError, consoleMessage } = require("./console");

exports.findBrands = async () => {
  try {
    const result = await Brand.find();
    return result; //Array
  } catch (err) {
    consoleError(err);
    // next(err)
  }
};

exports.findCategories = async () => {
  try {
    const result = await Category.find();
    return result; //Array
  } catch (err) {
    consoleError(err);
    // next(err)
  }
};

exports.findModels = async () => {
  try {
    const result = await Model.find();
    return result; //Array
  } catch (err) {
    consoleError(err);
    // next(err)
  }
};

exports.findVehicles = async () => {
  try {
    const result = await Vehicle.find().populate("model").populate("brand").exec();
    return result; //Array
  } catch (err) {
    consoleError(err);
    // next(err)
  }
};
