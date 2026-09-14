import { fileToArrayBuffer } from '../fileToArrayBuffer';
import { parsePNGChunks } from './parsePNGChunks';
import { type PNGMetaData } from './types';

let pngChunksExtract: any;

export async function readPNGXMPMetaData(file: File): Promise<PNGMetaData> {
	if (!pngChunksExtract) {
		const module = await import('png-chunks-extract');
		pngChunksExtract = module.default || module;
	}

	const buffer = await fileToArrayBuffer(file);
	const chunks = pngChunksExtract(buffer);

	return await parsePNGChunks(chunks);
}
