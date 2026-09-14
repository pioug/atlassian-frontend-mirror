import { dataURItoFile } from './dataURItoFile';
import { type FileInfo } from './imageMetaData/types';

export async function getFileInfoFromSrc(src: string, file?: File): Promise<FileInfo> {
	return {
		file: file || (await dataURItoFile(src)),
		src,
	};
}
