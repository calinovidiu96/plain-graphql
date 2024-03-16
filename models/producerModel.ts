import mongoose, { Schema } from "mongoose";

const producerSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	country: {
		type: String,
	},
	region: {
		type: String,
	},
});

export default mongoose.model("Producer", producerSchema);
