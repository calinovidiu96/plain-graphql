import path from "path";

import { deleteFile } from "./deleteTempFile";
import { writeTempFile } from "./writeTempFile";
import { importToDatabase } from "./importToDatabase";

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

		await importToDatabase(tempFilePath as string);

		return { success: true };
	} catch (error) {
		console.log("File upload failed", error);
		throw error;
	} finally {
		// Delete the temporary file regardless of success or failure
		if (tempFilePath) {
			await deleteFile(tempFilePath);
		}
	}
};

export { uploadDocument };
