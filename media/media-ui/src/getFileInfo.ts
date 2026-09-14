import { fileToDataURI } from './fileToDataURI';
import { type FileInfo } from './imageMetaData/types';

export async function getFileInfo(file: File, src?: string): Promise<FileInfo> {
	return {
		file,
		src: src || (await fileToDataURI(file)),
	};
}
