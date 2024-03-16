import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
	vintage: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	producerId: {
		type: Schema.Types.ObjectId,
		ref: "Producer",
	},
	producer: {
		type: String,
	},
	color: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	format: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	duty: {
		type: String,
		required: true,
	},
	availability: {
		type: String,
		required: true,
	},
	conditions: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
});

export default mongoose.model("Product", productSchema);
