/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';

export async function clearFolder(reportFolder: string): Promise<void> {
	console.log('Clearing report folder:', reportFolder);
	// Create the folder if it doesn't exist
	await fs.mkdir(reportFolder, { recursive: true });

	const filesToDelete = await fs.readdir(reportFolder);
	for (const file of filesToDelete) {
		const filePath = path.join(reportFolder, file);
		await fs.unlink(filePath);
	}
}
