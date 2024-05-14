const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    minlength: [2, "A user's name must have a minlength of 2 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid Email! Please enter a valid Email"],
  },
  photo: {
    type: String,
    minlength: [2, "A user's photo must have a minlength of 2 characters"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "A user's password must have a minlength of 8 characters"],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a confirm password"],
    minlength: [8, "A user's password must have a minlength of 8 characters"],
    trim: true,
    validate: {
      // This will only work on save or on create so when we are updating the user we should save the user not update because updateOne or findByIdAndUpdate will never validate the password  and confirm password
      validator: function (val) {
        return val === this.password;
      },
      message: "Password and confirm password does not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Removing that users from the list who have active set to false or deactivated their account
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Hash the password before saving in the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // check is performed if password is not modified then proceed to the next middleware without proceeding to the further code

  this.password = await bcrypt.hash(this.password, 12); // Here default value for cpu intensive is 10 and we are using 12 for generating the password for the better hash of the password and more secure and note one thing never add a very large number because your hash may become more secure but the time taken to generate that hash will be long so you better have 12 as a cpu intensive for generation of the bcrypted password

  this.passwordConfirm = undefined; // Not storing the confirm password in the DB

  next();
});

// Updating the passwordChangedAt on resetting the password
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Creating a method on userschema which will be available in all documents. This is done so to follow a best rule fat models and thin controllers
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Cheking that if the user have changed the password after logging in
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }

  // False means not changed
  return false;
};

// Create a Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken, passwordResetToken: this.passwordResetToken });

  let temMins = 10 * 60 * 1000;
  this.passwordResetExpires = Date.now() + temMins;
  return resetToken;
};

const User = mongoose.model("Users", userSchema);
module.exports = User;
