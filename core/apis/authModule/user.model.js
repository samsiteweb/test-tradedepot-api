const mongoose = require("mongoose");
const schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const geocoder = require('../../common/functions/geocoder')


const userSchema = new schema(
  {
    fName: {
      type: String,
      default: null,
    },
    lName: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      unique: true,
      default: null,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
    },
    dob: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "User's email is invalid"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    channel: {
      type: String,
      enum: ["Web", "Mobile"],
      default: "Web",
    },
    imgUrl: {
      type: String,
    },
    address: {
      type: String,
      default: null
    },
    regDate: {
      type: Date,
      default: Date.now(),
    },
    regDatex: {
      type: String,
      default: Date.now(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: null
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    about: {
      type: String,
    },
    xroles: {
      type: String,
      enum: ["user", "publisher", "admin", "superAdmin"],
      default: "user",
    },
    hashP: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      default: "self",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



userSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    stateCode: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }
  next();
});


// Match user password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.hashP);
};

userSchema.pre("save", async function (next) {
  this.email = this.email.toLowerCase();
  const salt = await bcrypt.genSalt(10);
  this.hashP = await bcrypt.hash(this.hashP, salt);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { user: `${this.email}` },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
