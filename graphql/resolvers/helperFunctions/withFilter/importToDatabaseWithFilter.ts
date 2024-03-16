import { ReadStream, createReadStream } from "fs";
import csvParser from "csv-parser";
import ProducerModel from "../../../../models/producerModel";
import ProductModel from "../../../../models/productModel";

const importToDatabaseWithFilter = async (filePath: string) => {
	const readStream: ReadStream = createReadStream(filePath);
	const producerCache = new Map<string, string>();

	// Create a promise that resolves when all data is processed
	const processingComplete = new Promise<void>((resolve, reject) => {
		readStream
			.pipe(csvParser({ headers: true }))
			.on("data", async (row: any) => {
				const vintage = row._0;
				const productName = row._1;
				const producerName = row._2;
				const country = row._3;
				const region = row._4;
				const color = row._5;
				const quantity = row._6;
				const format = row._7;
				const price = row._8;
				const duty = row._9;
				const availability = row._10;
				const conditions = row._11;
				const imageUrl = row._12;

				try {
					let producerIdInCache = producerCache.get(producerName);
					if (!producerIdInCache) {
						let producer = await ProducerModel.findOne({
							name: producerName,
							country,
							region,
						});

						if (!producer) {
							producer = await ProducerModel.create({
								name: producerName,
								country,
								region,
							});
						}

						producerIdInCache = producer._id.toString();
						producerCache.set(producerName, producerIdInCache);
					}

					// Create a product for every row
					await ProductModel.create({
						vintage,
						name: productName,
						producerId: producerIdInCache,
						country,
						region,
						color,
						quantity,
						format,
						price,
						duty,
						availability,
						conditions,
						imageUrl,
					});
				} catch (error: any) {
					console.error("Error processing row:", error);
				}
			})
			.on("end", () => {
				console.log("CSV data processing completed.");
				resolve(); // Resolve the processingComplete promise when CSV processing is complete
			})
			.on("error", (error: any) => {
				console.error("CSV data processing error:", error);
				reject(error); // Reject the processingComplete promise if there's an error during CSV processing
			});
	});

	// Wait for the end of the stream before returning
	await processingComplete;

	// Return any data you need
	return { success: true };
};

export { importToDatabaseWithFilter };
