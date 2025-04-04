const express = require("express");
const { test, updateUser } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyuser");

const router = express.Router();

router.get("/", test)
router.put("/update/:userId",verifyToken, updateUser)

module.exports = router;