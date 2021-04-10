var randomatic = require('randomatic');
var smtpTransport = require('nodemailer-smtp-transport');
const geocoder = require('./geocoder')
const sgMail = require('@sendgrid/mail')
const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
	apiKey: "907bf3ce",
	apiSecret: "ku8YC7DjvxCpCrm2"
})
  
module.exports = {
	getQrCode: async () => {
		let result = await randomatic('A0', 6);
		return result;
	},
	RADIUS: (distanceInkm) => {
		return distanceInkm / 6378;
	},

	geoCode: async (address) => {
		const loc = await geocoder.geocode(this.address);
		return location = {
			type: 'Point',
			coordinates: [loc[0].longitude, loc[0].latitude],
			formattedAddress: loc[0].formattedAddress,
			street: loc[0].streetName,
			city: loc[0].city,
			stateCode: loc[0].stateCode,
			zipcode: loc[0].zipcode,
			country: loc[0].countryCode,
		}
	},

	sendMail: async (payload) => {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		const msg = {
		to: payload.to, // Change to your recipient
		from: 'sam@yokunbo.com', // Change to your verified sender
		subject: payload.subject,
		text: payload.msg,
		}	
		sgMail
		.send(msg)
			.then((res) => {

			return res
			
		})
		.catch((error) => {
			console.error(error)
		})
	},

	
	sendSms: async (payload) => {
		const {from, to, text} = payload
		vonage.message.sendSms(from, to, text, (err, responseData) => {
			if (err) {
				console.log(err);
			} else {
				if(responseData.messages[0]['status'] === "0") {
					console.log("Message sent successfully.");
				} else {
					console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
				}
			}
		})
	}

}