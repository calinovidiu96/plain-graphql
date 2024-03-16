import fs from "fs";

const deleteFile = async (tempFilePath: any) => {
	return new Promise<void>((resolve, reject) => {
		fs.unlink(tempFilePath, (err) => {
			if (err) {
				reject(err);
			} else {
				console.log("Temporary file deleted successfully.");
				resolve();
			}
		});
	});
};

export { deleteFile };
