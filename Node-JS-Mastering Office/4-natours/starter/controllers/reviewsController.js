const Reviews = require("./../model/reviewModel");
const factory = require("./handlerFactory");
// const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = factory.getAll(Reviews);

exports.setTourAndUserID = (req, res, next) => {
  // Allowing Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(Reviews);
exports.createReview = factory.createOne(Reviews);
exports.updateReview = factory.updateOne(Reviews);
exports.deleteReview = factory.deleteOne(Reviews);
