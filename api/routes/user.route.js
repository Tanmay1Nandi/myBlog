const express = require("express");
const { test, updateUser, deleteUser, signout, getUsers, adminDeleteUser, getUser } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyuser");

const router = express.Router();

router.get("/", test);
router.put("/update/:userId",verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.delete("/adminDelete/:userId", verifyToken, adminDeleteUser);
router.get("/:userId", getUser);

module.exports = router;