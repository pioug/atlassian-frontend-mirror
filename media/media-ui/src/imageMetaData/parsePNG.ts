import { fileToArrayBuffer } from '../util';
import { PNGMetaData, PNGChunk } from './types';

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

export async function parsePNGChunks(chunks: PNGChunk[]): Promise<PNGMetaData> {
  let iTXt = '';
  let pHYs = {};
  /**
   * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.Summary-of-standard-chunks
   * Order of every chunk is not guaranteed.
   * And both iTXt and pHYs are Ancillary chunks.
   */
  for (let i = 0; i < chunks.length; ++i) {
    const chunk = chunks[i];

    // Must be last
    if (chunk.name === 'IEND') {
      break;
    }

    /**
     * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.Anc-text
     * iTXt contains the useful XMP/XML string data of meta tags
     */
    if (chunk.name === 'iTXt') {
      iTXt = String.fromCharCode.apply(null, Array.from(chunk.data));
    }
    /**
     * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.pHYs
     * Pixels per unit, X axis: 4 bytes (unsigned integer)
     * Pixels per unit, Y axis: 4 bytes (unsigned integer)
     * Unit specifier:          1 byte  (0: unit is unknown 1: unit is the meter)
     */
    if (chunk.name === 'pHYs') {
      const dv = new DataView(chunk.data.buffer);
      const unitSpecifier = dv.getUint8(8);
      // meter
      if (unitSpecifier === 1) {
        const PixelPerUnitX = dv.getUint32(0);
        const PixelPerUnitY = dv.getUint32(4);
        pHYs = { PixelPerUnitX, PixelPerUnitY };
      }
    }
  }

  return { iTXt, pHYs };
}
