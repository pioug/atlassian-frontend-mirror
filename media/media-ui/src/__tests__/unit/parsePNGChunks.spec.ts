import { parsePNGChunks } from '../../imageMetaData/parsePNG';

describe('PNG Image Metadata', () => {
  describe('Parse PNG Chunks', () => {
    const someDataArray = new Uint8Array(1);
    const iTXtDataArray = new Uint8Array([116, 0, 101, 0, 115, 0, 116, 0]);
    const pHYsDataArrayInMeters = new Uint8Array([
      0,
      0,
      22,
      37,
      0,
      0,
      22,
      37,
      1,
    ]);
    const pHYsDataArrayNotInMeters = new Uint8Array([
      0,
      0,
      22,
      37,
      0,
      0,
      22,
      37,
      0,
    ]);
    const chunks = [
      { name: 'IHDR', data: someDataArray },
      { name: 'gAMA', data: someDataArray },
      { name: 'pHYs', data: pHYsDataArrayInMeters }, // we only care about this...
      { name: 'iTXt', data: iTXtDataArray }, // and this...
      { name: 'IDAT', data: someDataArray },
      { name: 'IEND', data: someDataArray },
    ];

    it('should find the iTXt chunk', async () => {
      const { iTXt } = await parsePNGChunks(chunks);
      const expectedStr = String.fromCharCode.apply(
        null,
        Array.from(iTXtDataArray),
      );
      expect(iTXt).toEqual(expectedStr);
    });

    it('should find the pHYs chunk with meters unit specifier', async () => {
      const { pHYs } = await parsePNGChunks(chunks);
      expect(pHYs.PixelPerUnitX).toEqual(5669);
      expect(pHYs.PixelPerUnitY).toEqual(5669);
    });

    it('should not find the pHYs chunk with meters unit specifier', async () => {
      chunks[2].data = pHYsDataArrayNotInMeters;
      const { pHYs } = await parsePNGChunks(chunks);
      expect(pHYs).not.toHaveProperty('PixelPerUnitX');
      expect(pHYs).not.toHaveProperty('PixelPerUnitY');
    });
  });
});
