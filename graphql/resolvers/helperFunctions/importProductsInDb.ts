import { ReadStream, createReadStream } from "fs";
import csvParser from "csv-parser";
import ProducerModel from "../../../models/producerModel";
import ProductModel from "../../../models/productModel";

const importProductsInDb = async (filePath: string): Promise<void> => {
	const readStream: ReadStream = createReadStream(filePath);

	return new Promise<void>((resolve, reject) => {
		readStream
			.pipe(csvParser({ headers: true }))
			.on("data", async (row: any) => {
				const vintage = row._0;
				const productName = row._1;
				const producerName = row._2;
				const color = row._5;
				const quantity = row._6;
				const format = row._7;
				const price = row._8;
				const duty = row._9;
				const availability = row._10;
				const conditions = row._11;
				const imageUrl = row._12;

				const producer = await ProducerModel.findOne({
					name: producerName,
				});

				if (producer) {
					try {
						// Create product using the fetched producer ID
						await ProductModel.create({
							vintage,
							productName,
							producerId: producer._id,
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
						// Handle error
						reject(error);
					}
				} else {
					console.error(
						`Producer not found for name: ${producerName}. Skipping product creation.`
					);
				}
			})
			.on("end", () => {
				resolve(); // Resolve promise when CSV processing is complete
			})
			.on("error", (error: any) => {
				reject(error); // Reject promise if there's an error during CSV processing
			});
	});
};

export { importProductsInDb };
