var express = require("express");
var router = express.Router();
const {
  get_newBrand,
  post_newBrand,
  get_newModel,
  post_newModel,
  get_newCategory,
  post_newCategory,
  get_newVehicle,
  post_newVehicle,
  get_VehicleInstance,
  post_VehicleInstance,
} = require("../controllers/newRouter/Controllers");

function noimplemented(req, res) {
  res.send("no implementado");
}

router.get("/", noimplemented);

router.get("/category", get_newCategory);
router.post("/category", post_newCategory);

router.get("/brand", get_newBrand);
router.post("/brand", post_newBrand);

router.get("/model", get_newModel);
router.post("/model", post_newModel);

router.get("/vehicle", get_newVehicle);
router.post("/vehicle", post_newVehicle);

router.get("/vehicleinstance", get_VehicleInstance);
router.post("/vehicleinstance", post_VehicleInstance);

module.exports = router;
