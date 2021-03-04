const { body, validationResult } = require("express-validator");
const Vehicle = require("../../models/vehicle");
const Instance = require("../../models/instance");
const Brand = require("../../models/brand");
const Model = require("../../models/model");
const { consoleError, consoleMessage } = require("../../utils/console");

const {
  findCategories,
  findBrands,
  findModels,
  findVehicles,
} = require("../../utils/consults");

//*......................................List......................................//
exports.vehicles_list = async (req, res) => {
  try {
    const results = await Vehicle
      .find()
      .populate("category")
      .populate("model")
      .populate("brand");
    
    consoleMessage("List of vehicles:", results);
    
    res.render("vehicles_list", {
      title: "List of vehicles",
      vehicles: results,
    });
  } catch (error) {
    consoleError(error);
    return;
  }
};

// *.....................................Get..................................... //

exports.getVehicle = async (req, res) => {
  try {
    const brand = req.params.brand,
      model = req.params.model;

    const findBrand = await Brand.findOne({ companyname: brand });

    const findModel = await Model.findOne({
      name: model,
      brand: findBrand._id,
    });

    const result = await Vehicle.findOne({
      brand: findBrand._id,
      model: findModel._id,
    });

    const categories = await findModels();

    consoleMessage("result:", result);

    res.render("vehicle", {
      title: `${findBrand.companyname} model ${findModel.name}`,
      model: findModel,
      brand: findBrand,
      data: result,
    });
  } catch (error) {
    consoleError(error);
    return;
  }
};

//* ................................. Update ................................. */

exports.get_update_vehicle = async (req, res) => {
  try {
    const brand = req.params.brand;
    const model = req.params.model;
    const categories = await findCategories();

    const brandResult = await Brand.findOne({ companyname: brand });
    const modelResult = await Model.findOne({
      brand: brandResult._id,
      name: model,
    });

    const result = await Vehicle.findOne({
      brand: modelResult.brand,
      model: modelResult._id,
    })
      .populate("category")
      .populate("brand")
      .populate("model")
      .exec();

    consoleMessage("result:", result);
    consoleMessage("categories:", categories);

    res.render("update_vehicle_form", {
      title: `Update ${req.params.brand} ${req.params.model}`,
      categories,
      result,
    });
  } catch (error) {
    consoleError(error);
    return;
  }
};

exports.post_update_vehicle = [
  body("price").trim().isNumeric().escape(),

  async (req, res, next) => {
    try {

      let vehicle = new Vehicle({
        _id: req.body.vehicleId,
        type: "auto",
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
      });

      await Vehicle.findByIdAndUpdate(req.body.vehicleId, vehicle, { new: true });

      res.redirect(
        "/all/auto/" +
        req.params.brand +
        "/" +
        req.params.model
        );
    } catch (error) {
      consoleError(error);
      return next(error);
    }
  },
];
//* ................................. Delete ................................. */

exports.get_vehicle_delete = async (req, res) => {
  try {
    const vehicleid = req.params.vehicleid;
    const result = await Vehicle.findById(vehicleid);
    consoleMessage("", result);
  } catch (error) {
    consoleError(error);
    return;
  }
};

exports.post_vehicle_delete = async (req, res, next) => {
  try {
    const vehicleid = req.params.vehicleid;
    await Vehicle.findByIdAndRemove(vehicleid);
    consoleMessage("", result);
  } catch (error) {
    consoleError(error);
    return next(error);
  }
};
