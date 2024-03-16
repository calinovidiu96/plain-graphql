import path from "path";

import { deleteFile } from "./deleteTempFile";
import { writeTempFile } from "./writeTempFile";
import { importToDatabase } from "./importToDatabase";
import { importToDatabaseWithFilter } from "./withFilter/importToDatabaseWithFilter";
import { importProducersInDb } from "./withFilter/importProducersInDb";

const uploadDocument = async (root: any) => {
	let tempFilePath: string | undefined;

	try {
		// Wait for the promise in Upload to resolve
		const filePath = await root.file.promise;
		// Check if the file exists in the nested structure of root object
		if (!root || !root.file || !root.file.file) {
			throw new Error("File not found in request");
		}

		// Check if the file is a CSV file
		if (path.extname(filePath.filename).toLowerCase() !== ".csv") {
			throw new Error("Only CSV files are allowed");
		}

		tempFilePath = (await writeTempFile(
			filePath,
			filePath.filename
		)) as string;

		if (!tempFilePath) {
			throw new Error("Something went wrong. No file path found.");
		}

		// For an organized relationship between Producers and Products
		// use the next two functions:
		// * First function will introduce all producers from the .csv file (by unique names)
		// * Second function will introduce all products (with a producerId)
		//
		// For eficiency, the importToDatabaseWithFilter function uses a Map
		// that will store the found users with the Name as KEY and producerId as VALUE
		// so it will take the Producer from the Map for next products with the same producerName

		// await importProducersInDb(tempFilePath);
		// await importToDatabaseWithFilter(tempFilePath);

		// For BULK import of Products without a relationship of producerId
		// just with the producerName assinged, use the next function

		await importToDatabase(tempFilePath as string);

		return { success: true };
	} catch (error) {
		console.log("File upload failed", error);
		throw error;
	} finally {
		// Delete the temporary file regardless of success or failure
		if (tempFilePath) {
			await deleteFile(tempFilePath);
			console.log("tempFilePath", tempFilePath);
		}
	}
};

export { uploadDocument };
