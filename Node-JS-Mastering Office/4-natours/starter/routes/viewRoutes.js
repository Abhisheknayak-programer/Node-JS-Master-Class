const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.login, viewsController.getOverview);
router.get("/tour/:slug", authController.login, viewsController.getTour);
router.get("/login", authController.login, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
