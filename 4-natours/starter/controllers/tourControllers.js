const Tour = require("./../model/tourModel");
const APIFeature = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

// MIDDLEWARES DECLRATIONS
// 127.0.0.1:6000/api/v1/tours/top-5-cheap
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

///////// TOURS ROUTE HANDLERS ///////////
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query; // Execute the query

  res.status(200).json({
    status: "success",
    data: {
      tours: tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findOne({_id : req.params.id}); // Alternative

  if (!tour) return next(new AppError("No Tour found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Means after update is done it will return the newly updated data so that can be returned to UI for updating
    runValidators: true, // Means It will check for validation with the new data which is coming on this request
  });

  if (!tour) return next(new AppError("No Tour found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
    message: "Updated tour",
  });
});

exports.deleteATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError("No Tour found with that ID", 404));

  res.status(204).json({
    status: "success",
    message: "Deleted Successfully!",
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: "$ratingsAverage",
        // _id: "$difficulty",
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates", //startDates Array will be converted into documents for each element present in the startDates means 9 documents will become around 20 documents
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" }, // Means to add one field we use this operator
    },
    {
      $project: { _id: 0 }, //To remove we add 0 or else 1
    },
    {
      $sort: { numTourStarts: -1 }, // 1 for ascending and -1 for descending
    },
    {
      $limit: 6, // Limit is used to set how many documents you want to send as response
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { plan },
  });
});
