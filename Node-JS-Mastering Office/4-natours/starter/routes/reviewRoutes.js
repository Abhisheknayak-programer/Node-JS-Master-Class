const express = require("express");
const reviewController = require("./../controllers/reviewsController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });
// MergeParams helps to access all the id of tours to run the route
// URL : /api/v1/tours/5c88fa8cf4afda39709c2955/reviews
// Note : Even if it is the above url or/api/v1/reviews the below post route will be executed

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourAndUserID,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
