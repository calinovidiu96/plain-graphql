import Producer from "../../models/producerModel";

type IProducer = {
	name: string;
	country: string;
	region: string;
};

export default {
	createProducer: async ({ input }: { input: IProducer }) => {
		try {
			const existingProducer = await Producer.findOne({
				name: input.name,
			});
			if (existingProducer) {
				throw new Error("Producer exists already.");
			}

			const producer = new Producer({
				name: input.name,
				country: input.country,
				region: input.region,
			});

			const result = await producer.save();

			// Destructure _id from the result
			const { _id, ...createdProducer } = result.toObject();

			return { ...createdProducer, _id };
		} catch (error) {
			throw new Error(`Failed to create producer. ${error}`);
		}
	},
};
