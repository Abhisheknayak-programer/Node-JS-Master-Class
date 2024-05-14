const mongoose = require("mongoose");
const slugify = require("slugify");
// const Users = require("./userModel");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  // Schema Description
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true, // to remove the whitespaces from the begin and end
      minlength: [5, "A tour name must have more or equal to 5 characters"],
      maxlength: [40, "A tour name must have less or equal to 40 characters"],
      // validate: [validator.isAlpha, "Tour name can only contains characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings must be above 1"],
      max: [5, "Ratings must be less or equal to 5"],
      set: (val) => Number(val).toFixed(2),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: "Price Discount cannot be less than price",
        validator: function (val) {
          return this.price < val ? false : true; // This only points to current doc on new document creation
        },
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true, // to remove the whitespaces from the begin and end
    },
    description: {
      type: String,
      trim: true, // to remove the whitespaces from the begin and end
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //To hide this from response
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],
  },
  // Schema Options
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing is done to improve performance when we are doing any kind of filteration query. The most filtered key can be taken and added inside the index and sort with 1 for asc to desc and viceversa and you can check the faster working of this in controller when you are quering for a data then add .explain() function to your find method and check total documents examined and nReturned.
// Note : Use Indexing when you are not updating the documents of these collection faster
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// Virtual Property Declaration
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual Populate for connecting two models
tourSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});

// Document Middleware : runs before the .save() and .create() but not in insertOne() or insertMany()
tourSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Getting the Data of guides at the time of saving [Embedding Method]
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(
//     async (id) => await Users.findById(id)
//   );

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre("save", function (next) {
//   console.log("Running pre hooks also known as middleware");
//   next();
// });

// // Document Middleware : runs after the .save() and .create() but not in insertOne() or insertMany()
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Populating the guide whenever any find query is executed [Referencing Method] -- Getting the Data of guides at the time of fetching
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// Aggregation Middleware // Commented This for Geospatial calculation of Distance
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
