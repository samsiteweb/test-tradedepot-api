const Products = require("./productMgt.model");
const asyncHandler = require("../../common/asyncHandler/async");
const { successResponse, failResponse } = require("../../common/responseHandler/response");
const axios = require("axios");
const User = require("../authModule/user.model")
const { RADIUS } = require("../../common/functions/universal")

exports.createProduct = asyncHandler(async (req, res) => {
  // check if user exist before 
  console.log(req.authUser._id)
  let payload = {
    createdBy: req.authUser.id,
    ...req.body
  }
  let product = await Products.create(payload)
  
  return successResponse(res, product)
})

exports.allProducts = asyncHandler(async (req, res, next) => {
  let products = await Products.find()
  return successResponse(res, products)
});
exports.allUserProducts = asyncHandler(async (req, res, next) => {
  let userProducts = await Products.find({ createdBy: req.authUser.id })
  return successResponse(res, userProducts )
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  let productId = req.query.id
  let userProducts = await Products.findOne({ _id: productId }).populate({path:'createdBy', select: 'fName lName'})
  return successResponse(res, userProducts )
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let products = await Products.findOneAndDelete({ _id: req.query.id })
  return successResponse(res, products)
});

exports.productsWithInaDistance = asyncHandler(async (DISTANCE, LNG, LAT) => {
  const VALIDATORS = await User.find({
    location: { $geoWithin: { $centerSphere: [[LNG, LAT], RADIUS(DISTANCE)] } }
  })
  return VALIDATORS
})

exports.productByLocation = asyncHandler(async (req, res, next) => {
	// let PAGE = req.paginate.page;
	// let SIZE = req.paginate.size
 
  let LOCATION = await User.findOne({ _id: req.authUser.id }).select('location')
	let { coordinates } = LOCATION.location
	// let STATUS = req.query.status
	let DISTANCE_IN_KM = req.query.distance ? req.query.distance : 50
	// let LNG = req.query.presentLng
	// let LAT = req.query.presentLat
	if (req.query.usePresentLocation === 'true') {
		LNG = Number(req.query.presentLng)
		LAT = Number(req.query.presentLat)
	} else {
		LNG = coordinates[0]
		LAT = coordinates[1]
	}
	let products = await Products.find({
			location: { $geoWithin: { $centerSphere: [[LNG, LAT], RADIUS(DISTANCE_IN_KM)] } }
		})
	
	return successResponse(res, products);
})




