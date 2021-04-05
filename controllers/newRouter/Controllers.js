require("dotenv").config();

const { consoleMessage, consoleError } = require("../../utils/console");
const { validationResult, body } = require("express-validator");
const {
  findCategories,
  findBrands,
  findModels,
  findVehicles,
} = require("../../utils/consults");

const { createClient } = require("pexels");

const client = createClient(process.env.PEXELS_API_KEY);

async function getPhotoFromPexels(query = "cars") {
  try {
    const per_page = 20;
    const result = await client.photos.search({
      query,
      per_page,
      orientation: "landscape",
    });
    consoleMessage("photos: src", result.photos.length);
    return result.photos[Math.floor(Math.random() * per_page)].src.large2x;
  } catch (error) {
    consoleError(error);
  }
}

const Brand = require("../../models/brand");
const Model = require("../../models/model");
const Category = require("../../models/category");
const Vehicle = require("../../models/vehicle");
const VehicleInstance = require("../../models/instance");

//*-------------------------------------------------------------------------//
//*..................................Brand..................................//
//*-------------------------------------------------------------------------//
exports.get_newBrand = (req, res) => {
  res.render("./forms/new_brand_form", {
    title: "Register a new brand",
  });
};

exports.post_newBrand = [
  body("companyname", "branch value must be specified")
    .trim()
    .notEmpty()
    .escape(),
  body("website", "the web value must be a valid url").trim().isURL().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    consoleError(errors.array(), "invalid data form!");
    consoleError(req.body, "data Sent!");

    if (errors.isEmpty()) {
      const { companyname, website, logo } = req.body;
      const brand = new Brand({ companyname, website });

      const isRegisted = await Brand.findOne({ companyname });
      if (!isRegisted) await brand.save();

      res.redirect("/");
    }

    res.render("./forms/new_brand_form", {
      title: "Register a new brand",
      errors: errors.array(),
      dataSent: req.body,
    });
  },
];

//*-------------------------------------------------------------------------//
//*..................................Model..................................//
//*-------------------------------------------------------------------------//

exports.get_newModel = async (req, res) => {
  const registedBrands = await findBrands();
  consoleMessage("registed brands:", registedBrands);

  res.render("./forms/new_model_form", {
    title: "Register a new model of vehicle",
    registedBrands,
  });
};

exports.post_newModel = [
  body("modelName", "brand's model name most be especified")
    .trim()
    .notEmpty()
    .escape(),
  body("brand", "brand most be especified").trim().notEmpty().escape(),
  body("year")
    .toInt()
    .custom((value) => {
      if (value < 1885) throw new Error("invalid year");
      return true;
    })
    .escape(),

  async (req, res) => {
    const errors = validationResult(req);
    const { modelName, brand, year } = req.body;
    const dataSent = { modelName, brand, year };

    if (errors.isEmpty()) {
      const model = new Model(dataSent);
      const isRegisted = await Model.findOne(dataSent);

      if (!isRegisted) await model.save();

      res.redirect("/");
    }

    const registedBrands = await findBrands();

    res.render("./forms/new_model_form", {
      title: "Register a new model of vehicle",
      registedBrands,
      errors: errors.array(),
      dataSent,
    });
  },
];

//*-------------------------------------------------------------------------//
//*.................................Category.................................//
//*-------------------------------------------------------------------------//
exports.get_newCategory = (req, res) => {
  res.render("./forms/new_category_form", { title: "New Category" });
};

exports.post_newCategory = [
  body("name", "Category name most be especified")
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .escape(),

  async (req, res) => {
    const errors = validationResult(req),
      { name } = req.body,
      dataSent = { name };

    if (errors.isEmpty()) {
      const category = new Category(dataSent),
        isRegisted = await Category.findOne(dataSent);

      if (!isRegisted) await category.save();

      res.redirect("/");
    }

    res.render("./forms/new_category_form", {
      title: "New Category",
      errors: errors.array(),
      dataSent,
    });
  },
];
//*-------------------------------------------------------------------------//
//*.................................Vehicle.................................// <
//*-------------------------------------------------------------------------//
exports.get_newVehicle = async (req, res) => {
  const results = await Promise.all([
    findCategories(),
    findBrands(),
    findModels(),
  ]);

  const categories = results[0],
    brands = results[1],
    models = results[2];

  consoleMessage("modles", models);

  res.render("./forms/new_vehicle_form", {
    title: "New vehicle",
    categories,
    brands,
    models,
  });
};

exports.post_newVehicle = [
  body("type").trim().notEmpty().isAlpha().escape(),
  body("category").trim().notEmpty().isAlphanumeric().escape(),
  body("brand").trim().notEmpty().isAlphanumeric().escape(),
  body("model").trim().notEmpty().isAlphanumeric().escape(),
  body("description").trim().isAlphanumeric().escape(),
  body("price").trim().notEmpty().toInt().isNumeric(),
  body("image").optional({nullable:true}).escape(),

  async (req, res) => {
    const errors = validationResult(req),
      {
        type,
        category,
        brand,
        model,
        description,
        price,
        image,
      } = req.body,
      dataSent = {
        type,
        category,
        brand,
        model,
        description,
        price,
        image,
      };

    if (errors.isEmpty()) {
      const vehicle = new Vehicle(dataSent),
        isRegisted = await Vehicle.findOne({ brand, model });

      if (!isRegisted) await vehicle.save();

      res.redirect(`/`);
    }

    const results = await Promise.all([
      findCategories(),
      findBrands(),
      findModels(),
    ]);

    const categories = results[0],
      brands = results[1],
      models = results[2];

    res.render("./forms/new_vehicle_form", {
      title: "New vehicle",
      categories,
      brands,
      models,
      errors: errors.array(),
      dataSent,
    });
  },
];
//*-------------------------------------------------------------------------//
//*.............................VehicleInstance.............................// <-----------------
//*-------------------------------------------------------------------------//
exports.get_VehicleInstance = async (req, res) => {
  const results = await findVehicles();

  consoleMessage("aver:", results);

  res.render("./forms/new_vehicleInstance_form", {
    title: "Post a new vehicle",
    results,
  });
};

exports.post_VehicleInstance = [
  body("vehicle").isAlphanumeric().isLength({ min: 1 }).escape(),
  body("color").isLength({ min: 1 }).escape(),
  body("rinZise").isNumeric().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { vehicle, color, rinZise } = req.body;
      const vehicleInstance = new VehicleInstance({ vehicle, color, rinZise });
      await vehicleInstance.save();

      res.redirect("/");
    }

    consoleError(errors);
    const results = await findVehicles();

    res.render("./forms/new_vehicleInstance_form", {
      title: "Post a new vehicle",
      results,
      errors: errors.array(),
    });
  },
];
//*-------------------------------------------------------------------------//
