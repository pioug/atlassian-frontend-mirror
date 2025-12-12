import fs from 'fs';
import path from 'path';
import { findRootSync } from '@manypkg/find-root';

/**
 * Writes a string to a file in `packages/adf-schema/src/${subfolder}/generated/${fileName}`
 * @param fileName The name of the file - including file extension
 * @param content The string containing the content of the file
 * @param subpath The subfolder to use, by default it is `next-schema`
 */
export function writeToFile(
	fileName: string,
	content: string,
	subpath: string = 'next-schema',
): void {
	const filePath = path.join(
		findRootSync(process.cwd()),
		'packages',
		'editor',
		'adf-schema',
		subpath,
		fileName,
	);
	fs.writeFileSync(filePath, content);
}
