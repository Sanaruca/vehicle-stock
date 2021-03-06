require("dotenv").config()

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

exports.get_newBrand = async (req, res) => {
  const img = await getPhotoFromPexels();
  // console.log("img", img);
  res.render("new_brand_form", { title: "Register a new brand", img });
};

exports.post_newBrand = [
  body("companyname").trim().isLength({ min: 1 }).escape(),

  body("website").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());

    if (errors.isEmpty()) {
      let brand = new Brand({
        companyname: req.body.companyname,
        website: req.body.website,
        logo: req.body.logo,
      });

      //*------------------------//
      const find = await Brand.find({ companyname: req.body.companyname });
      if (find.length < 1) await brand.save();
      res.redirect("/");
      //*------------------------//
    } else {
      res.render("new_brand_form", {
        title: "Register a new brand",
        errors: errors.array(),
      });
    }
  },
];

//*-------------------------------------------------------------------------//
//*..................................Model..................................//
//*-------------------------------------------------------------------------//

exports.get_newModel = async (req, res) => {
  const results = await findBrands();
  console.log(results);
  consoleMessage("results:", results);
  res.render("new_model_form", {
    title: "Register a new model of vehicle",
    registedBrands: results,
  });
};

exports.post_newModel = [
  body("name", "valor no espesificado").trim().isLength({ min: 1 }).escape(),
  body("brand", "valor no espesificado").trim().isLength({ min: 1 }).escape(),
  body("year").isAlphanumeric().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      let model = new Model({
        name: req.body.name,
        brand: req.body.brand,
        year: req.body.year,
      });

      //*------------------------//
      const find = await Model.findOne({
        name: req.body.name,
        brand: req.body.brand,
      });
      if (!find) await model.save();
      //*------------------------//
      res.redirect("/");
    }
    const results = await findBrands();
    res.render("new_model_form", {
      title: "Register a new model of vehicle",
      registedBrands: results,
      errors: errors.array(),
    });
  },
];

//*-------------------------------------------------------------------------//
//*.................................Category.................................//
//*-------------------------------------------------------------------------//
exports.get_newCategory = (req, res) => {
  res.render("new_category_form", { title: "New Category" });
};

exports.post_newCategory = [
  body("name", "El valor debe ser espesificado")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      let category = new Category({
        name: req.body.name,
      });

      //*------------------------//
      const find = await Category.find({ name: req.body.companyname });
      if (find.length < 1) await category.save();
      res.redirect("/");
      //*------------------------//
    } else {
      res.render("new_brand_form", {
        title: "New Category",
        errors: errors.array(),
      });
    }
  },
];
//*-------------------------------------------------------------------------//
//*.................................Vehicle.................................//
//*-------------------------------------------------------------------------//
exports.get_newVehicle = async (req, res) => {
  const results = await Promise.all([
    findCategories(),
    findBrands(),
    findModels(),
  ]);

  // consoleMessage("...", results);
  const categories = results[0];
  const brands = results[1];
  const models = results[2];

  res.render("new_vehicle_form", {
    title: "New vehicle",
    categories,
    brands,
    models,
  });
};

exports.post_newVehicle = [
  body("type").trim().isLength({ min: 1 }).isAlphanumeric().escape(),

  body("category").trim().isLength({ min: 1 }).isAlphanumeric().escape(),

  body("brand").trim().isLength({ min: 1 }).isAlphanumeric().escape(),

  body("model").trim().isLength({ min: 1 }).isAlphanumeric().escape(),

  body("description").trim().escape(),

  body("price").trim().isNumeric().escape(),

  body("image").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (errors.isEmpty()) {
      let vehicle = new Vehicle({
        type: req.body.type,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
      });

      let findVehicle = await Vehicle.findOne({
        brand: req.body.brand,
        model: req.body.model,
      })
        .populate("brand")
        .populate("model")
        .exec();

      consoleMessage("existe", findVehicle);

      if (!findVehicle) {
        await vehicle.save();

        findVehicle = await Vehicle.findById(vehicle._id.toString())
          .populate("brand")
          .populate("model")
          .exec();

        consoleMessage("bidasd:", findVehicle);
      }

      res.redirect(
        "/all/auto/" +
          findVehicle.brand.companyname +
          "/" +
          findVehicle.model.name
      );
    } else {
      consoleError(errors);
      const results = await Promise.all([
        findCategories(),
        findBrands(),
        findModels(),
      ]);

      const categories = results[0];
      const brands = results[1];
      const models = results[2];

      res.render("new_vehicle_form", {
        title: "New vehicle",
        categories,
        brands,
        models,
        errors: errors.array(),
      });
    }
  },
];
//*-------------------------------------------------------------------------//
//*.............................VehicleInstance.............................//
//*-------------------------------------------------------------------------//
exports.get_VehicleInstance = async (req, res) => {
  const results = await findVehicles();

  consoleMessage("aver:", results);

  res.render("new_vehicleInstance_form", {
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

      let vehicleInstance = new VehicleInstance({
        vehicle: req.body.vehicle,
        color: req.body.color,
        rinZise: req.body.rinZise,
      });

      await vehicleInstance.save();

      res.redirect("/");
    }
    consoleError(errors);

    const results = await findVehicles();


    res.render("new_vehicleInstance_form", {
      title: "Post a new vehicle",
      results,
      errors: errors.array()
    });
  },
];
//*-------------------------------------------------------------------------//
