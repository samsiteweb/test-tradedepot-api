const mongoose = require("mongoose");
const schema = mongoose.Schema;
const geocoder = require('../../common/functions/geocoder')


const productSchema = new schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    imgUrl: {type: String, required: true },
    productDetails: {type: String, required: true},
    availableAt: {
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.availableAt);
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


module.exports = mongoose.model("Products", productSchema);
