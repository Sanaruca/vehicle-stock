const express = require("express");
const { get_logOut } = require("../controllers/users");
const router = express.Router();

router.get("/", get_logOut);

module.exports = router;
