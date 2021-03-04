const {
  category_list,
  getCategory,
  get_update_category,
  post_update_category,
  get_delete_category,
  post_delete_category,
} = require("../controllers/allRouter/categoriesController");
const {
  
  vehicles_list,
  getVehicle,
  get_update_vehicle,
  post_update_vehicle
} = require("../controllers/allRouter/vehicleController");

var express = require("express");
var router = express.Router();

//----------------------------------------------------------------------------//
router.get("/");
//----------------------------------------------------------------------------//
////
//----------------------------------------------------------------------------//
router.get("/categories", category_list);
router.get("/category/:name", getCategory);
router.get("/category/:name/update");
router.get("/category/:name/delete");

//----------------------------------------------------------------------------//
////
//----------------------------------------------------------------------------//
router.get("/vehicles", vehicles_list);
router.get("/auto/:brand/:model", getVehicle);

router.get("/auto/:brand/update");
router.post("/auto/:brand/update");

router.get("/auto/:brand/delete");
router.post("/auto/:brand/delete");

router.get("/auto/:brand/:model/update", get_update_vehicle);
router.post("/auto/:brand/:model/update", post_update_vehicle);

router.get("/auto/:brand/:model/delete");
router.post("/auto/:brand/:model/delete");

router.get("/auto/:id/update");
router.post("/auto/:id/update");

router.get("/moto/:id/update");
router.post("/moto/:id/update");

router.get("/auto/:id/delete");
router.post("/auto/:id/delete");

router.get("/moto/:id/delete");
router.post("/moto/:id/delete");
//----------------------------------------------------------------------------//

module.exports = router;
