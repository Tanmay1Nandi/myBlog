const express = require("express");
const { verifyToken } = require("../utils/verifyuser");
const router = express.Router();
const {create, getposts} = require("../controllers/post.controller")

router.post("/create", verifyToken, create);
router.get("/getposts",getposts);

module.exports = router;