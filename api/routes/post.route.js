const express = require("express");
const { verifyToken } = require("../utils/verifyuser");
const router = express.Router();
const {create} = require("../controllers/post.controller")

router.post("/create", verifyToken, create);

module.exports = router;