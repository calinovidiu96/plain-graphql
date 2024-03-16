import { ReadStream, createReadStream } from "fs";
import csvParser from "csv-parser";
import ProducerModel from "../../../../models/producerModel";

const importProducersInDb = async (filePath: string) => {
	const readStream: ReadStream = createReadStream(filePath);

	const processingComplete = new Promise<void>((resolve, reject) => {
		readStream
			.pipe(csvParser({ headers: true }))
			.on("data", async (row: any) => {
				const producerName = row._2;
				const country = row._3;
				const region = row._4;

				if (producerName && producerName.length > 0) {
					try {
						await ProducerModel.create({
							name: producerName,
							country,
							region,
						});
					} catch (error: any) {
						if (error.code === 11000) {
							console.error(
								`Duplicate key error for producer: ${producerName}. Skipping...`
							);
						} else {
							reject(error);
						}
					}
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
};

export { importProducersInDb };
