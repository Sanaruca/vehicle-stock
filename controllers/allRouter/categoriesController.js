const { consoleError, consoleMessage } = require("../../utils/console");

const Brand = require("../../models/brand");
const Model = require("../../models/model");
const Category = require("../../models/category");
const Vehicle = require("../../models/vehicle");
const VehicleInstance = require("../../models/instance");

//-----------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------//
exports.category_list = async (req, res) => {
  try {
    const results = await Category.find();
    consoleMessage("All Categories:", results);

    res.render("categories_list", { title: "Categories", categories: results });
  } catch (error) {
    consoleError(error);
    return;
  }
};

//-----------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------//
exports.getCategory = async (req, res) => {
  try {
    const categoryresult = await Category.findOne({ name: req.params.name });
    consoleMessage("Category:", categoryresult);

    const vehiclesResult = await Vehicle.find({ category: categoryresult._id})
      .populate("brand")
      .populate("model")
      .exec();

    consoleMessage("vehicles:", vehiclesResult);

    res.render("get_category", {
      title: "Category",
      category: categoryresult,
      vehicles: vehiclesResult,
    });
  } catch (error) {
    consoleError(error);
    return;
  }
};


