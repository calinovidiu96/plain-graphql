import { join } from "path";
import fs from "fs";
import { tmpdir } from "os";
import csvParser from "csv-parser";

const expectedHeaders = [
	"Vintage",
	"Product Name",
	"Producer",
	"Country",
	"Region",
	"Colour",
	"Quantity",
	"Format",
	"Price (GBP)",
	"Duty",
	"Availability",
	"Conditions",
	"ImageUrl",
];

const writeTempFile = async (fileData: any, filename: any) => {
	return new Promise((resolve, reject) => {
		const tempFilePath = join(tmpdir(), filename);
		const writeStream = fs.createWriteStream(tempFilePath);
		const uniqueKeys = new Set();

		let headerValidated = false;

		fileData
			.createReadStream()
			.pipe(csvParser())
			.on("headers", (headers: string[]) => {
				// Check if the headers match the expected headers
				const isValid = expectedHeaders.every((header) =>
					headers.includes(header)
				);
				if (!isValid) {
					reject(new Error("Invalid CSV headers"));
				} else {
					headerValidated = true;
				}
			})
			.on("data", (row: any) => {
				if (!headerValidated) {
					return;
				}

				const vintage = row.Vintage;
				const productName = row["Product Name"];
				const producer = row.Producer;
				const color = row.Colour;
				const quantity = row.Quantity;
				const format = row.Format;
				const price = row["Price (GBP)"];
				const duty = row.Duty;
				const availability = row.Availability;

				// Skip the row if any of the required values are empty strings
				if (
					vintage.length == 0 ||
					productName.length == 0 ||
					producer.length == 0 ||
					color.length == 0 ||
					quantity.length == 0 ||
					format.length == 0 ||
					price.length == 0 ||
					duty.length == 0 ||
					availability.length == 0
				) {
					console.log("Skipping row due to missing required values.");
					return;
				}

				const key = `${vintage}_${productName}_${producer}`;

				if (!uniqueKeys.has(key)) {
					const csvRow =
						Object.values(row)
							.map((value: any) => {
								// Enclose the value with double quotes if it contains commas
								return value.includes(",")
									? `"${value}"`
									: value;
							})
							.join(",") + "\n";
					writeStream.write(csvRow);
					uniqueKeys.add(key);
				} else {
					console.log(`Found duplicate key ${key}. Skip this row.`);
				}
			})
			.on("end", () => {
				writeStream.end();
				console.log("Successfully wrote the temp file.");
				resolve(tempFilePath);
			})
			.on("error", (error: any) => {
				reject(error);
			});
	});
};

export { writeTempFile };
