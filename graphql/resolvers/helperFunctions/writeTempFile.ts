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
