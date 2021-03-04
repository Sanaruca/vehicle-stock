var express = require("express");
var router = express.Router();

const Brand = require("../models/brand");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const results = await Brand.find().limit(6);
  res.render("index", { title: "Welcome", brands: results });
});

module.exports = router;
