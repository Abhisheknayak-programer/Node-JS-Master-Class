// review, rating, createdAt, ref to tour and ref to user
const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A Review cannot be empty."],
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A Review must have a rating."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belongs to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Review must belongs to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Here Indexing is done to have each user and review to be unique [This helps to prevent duplicate reviews]
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate user and tour
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

// Defining a statics method to update the tour model avg ratings and ratings quantity
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRatings: { $avg: "$ratings" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to the current review
  this.constructor.calcAverageRatings(this.tour);
});

// Update avg ratings and ratings quantity when any review is edited or deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); //Finding the document which is going to be updated or deleted and storing that inside this so that it can be used in post middleware as we can't perform calculations inside the pre middleware
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour); // Using the stored r inside this object to perform the calculation of ratings qty and average
});

const Review = mongoose.model("Reviews", reviewSchema);
module.exports = Review;
