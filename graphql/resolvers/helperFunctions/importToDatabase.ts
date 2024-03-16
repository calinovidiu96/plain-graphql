import { ReadStream, createReadStream } from "fs";
import csvParser from "csv-parser";
import ProductModel from "../../../models/productModel";

const importToDatabase = async (filePath: string) => {
	const readStream: ReadStream = createReadStream(filePath);

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

			if (
				vintage &&
				productName &&
				color &&
				quantity &&
				format &&
				price &&
				duty &&
				availability
			) {
				await ProductModel.create({
					vintage,
					name: productName,
					producer: producerName,
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
			}
		})
		.on("end", async () => {
			console.log("CSV data processing completed.");
		})
		.on("error", (error: any) => {
			console.error("CSV data processing error:", error);
		});

	// Wait for the end of the stream before returning
	await new Promise((resolve) => {
		readStream.on("end", resolve);
	});
};

export { importToDatabase };
