const { get_signIn, post_signIn } = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.get("/", get_signIn);
router.post("/", post_signIn);

module.exports = router;
