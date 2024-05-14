const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeature = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No Document found with that ID", 404));

    res.status(204).json({
      status: "success",
      message: "Deleted Successfully!",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Means after update is done it will return the newly updated data so that can be returned to UI for updating
      runValidators: true, // Means It will check for validation with the new data which is coming on this request
    });

    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: doc,
      message: "Updated document",
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // TO ALLOW NESTED GET REQUESTS ON TOUR
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const doc = await features.query.explain(); // Explain method helps to explain all things in the query
    const doc = await features.query; // Execute the query

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
