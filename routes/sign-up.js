const { get_signUp, post_signUp } = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/", get_signUp);
router.post("/", post_signUp);

module.exports = router;
