const catchAsync = require("./../utils/catchAsync");
const Users = require("./../model/userModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

///////// USERS ROUTE HANDLERS ///////////
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create Error if user is trying to post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates", 400));
  }

  // 2. Filtered Out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3. Update user document
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1. Update the active field of the user but don't delete the user from the database
  await Users.findByIdAndUpdate(req.user.id, { active: false });

  // 2. Send a response to the UI that account is deactivated
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This Route is not yet defined",
  });
};

exports.getAllUsers = factory.getAll(Users);
exports.getUserById = factory.getOne(Users);
exports.updateUser = factory.updateOne(Users); // It will not update the password
exports.deleteUser = factory.deleteOne(Users);
