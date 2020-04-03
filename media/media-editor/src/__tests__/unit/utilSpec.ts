import {
  getUtf32Codes,
  getUtf32CodeUnits,
  adjustSize,
  hexToRgb,
  rgbToHex,
} from '../../util';

describe('MediaEditor Util', () => {
  describe('getUtf32Codes', () => {
    it('should return empty array when the text is empty', () => {
      const result = getUtf32Codes('');
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should return one code for one 2-byte character', () => {
      const result = getUtf32Codes('a');
      expect(result).toEqual([97]);
    });

    it('should return two codes for two 2-byte characters', () => {
      const result = getUtf32Codes('ab');
      expect(result).toEqual([97, 98]);
    });

    it('should return one code for a surrogate pair', () => {
      const result = getUtf32Codes('\uD852\uDF62');
      expect(result).toEqual([0x24b62]);
    });

    it('should return correct codes for a string with surrogate pairs', () => {
      const result = getUtf32Codes(
        'The text \u20AC appears to \uD834\uDF06 and \uD852\uDF62',
      );
      expect(result).toEqual([
        0x54,
        0x68,
        0x65,
        0x20,
        0x74,
        0x65,
        0x78,
        0x74,
        0x20,
        0x20ac,
        0x20,
        0x61,
        0x70,
        0x70,
        0x65,
        0x61,
        0x72,
        0x73,
        0x20,
        0x74,
        0x6f,
        0x20,
        0x1d306,
        0x20,
        0x61,
        0x6e,
        0x64,
        0x20,
        0x24b62,
      ]);
    });
  });

  describe('getUtf32CodeUnits', () => {
    it('should return empty array when the text is empty', () => {
      const result = getUtf32CodeUnits('');
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should return one character for one 2-byte character', () => {
      const result = getUtf32CodeUnits('a');
      expect(result).toEqual(['a']);
    });

    it('should return two characters for two 2-byte characters', () => {
      const result = getUtf32CodeUnits('ab');
      expect(result).toEqual(['a', 'b']);
    });

    it('should return one character for a surrogate pair', () => {
      const result = getUtf32CodeUnits('\uD852\uDF62');
      expect(result).toEqual(['\u{24B62}']);
    });

    it('should return correct characters for a string with surrogate pairs', () => {
      const result = getUtf32CodeUnits(
        'The text \u20AC appears to \uD834\uDF06 and \uD852\uDF62',
      );
      expect(result).toEqual([
        'T',
        'h',
        'e',
        ' ',
        't',
        'e',
        'x',
        't',
        ' ',
        '\u{20AC}',
        ' ',
        'a',
        'p',
        'p',
        'e',
        'a',
        'r',
        's',
        ' ',
        't',
        'o',
        ' ',
        '\u{1D306}',
        ' ',
        'a',
        'n',
        'd',
        ' ',
        '\u{24B62}',
      ]);
    });
  });

  describe('adjustSize', () => {
    let counter = 0;
    let deletedElements: Array<number> = [];

    const creator = () => counter++;
    const deleter = (i: number) => {
      deletedElements.push(i);
    };

    beforeEach(() => {
      counter = 0;
      deletedElements = [];
    });

    it('should do nothing if the array is empty and the required size is 0', () => {
      const arr: Array<number> = [];
      adjustSize(arr, 0, creator, deleter);

      expect(Object.keys(arr)).toHaveLength(0);
    });

    it('should do nothing if the array already has the required size', () => {
      const arr = [5, 6, 8];
      adjustSize(arr, 3, creator, deleter);

      expect(arr).toEqual([5, 6, 8]);
      expect(Object.keys(deletedElements)).toHaveLength(0);
    });

    it('should add 1 element to empty', () => {
      const arr: Array<number> = [];
      adjustSize(arr, 1, creator, deleter);

      expect(arr).toEqual([0]);
      expect(Object.keys(deletedElements)).toHaveLength(0);
    });

    it('should add 3 elements to empty', () => {
      const arr: Array<number> = [];
      adjustSize(arr, 3, creator, deleter);

      expect(arr).toEqual([0, 1, 2]);
      expect(Object.keys(deletedElements)).toHaveLength(0);
    });

    it('should add 1 element to not empty', () => {
      const arr = [55, 14];
      adjustSize(arr, 3, creator, deleter);

      expect(arr).toEqual([55, 14, 0]);
      expect(Object.keys(deletedElements)).toHaveLength(0);
    });

    it('should add 3 elements to not empty', () => {
      const arr = [55, 14];
      adjustSize(arr, 5, creator, deleter);

      expect(arr).toEqual([55, 14, 0, 1, 2]);
      expect(Object.keys(deletedElements)).toHaveLength(0);
    });

    it('should make 1 element array empty', () => {
      const arr = [123];
      adjustSize(arr, 0, creator, deleter);

      expect(Object.keys(arr)).toHaveLength(0);
      expect(deletedElements).toEqual([123]);
    });

    it('should make 5 element array empty', () => {
      const arr = [12, 34, 56, 78, 90];
      adjustSize(arr, 0, creator, deleter);

      expect(Object.keys(arr)).toHaveLength(0);
      expect(deletedElements).toEqual([12, 34, 56, 78, 90]);
    });

    it('should remove 1 element', () => {
      const arr = [12, 34, 56, 78, 90];
      adjustSize(arr, 4, creator, deleter);

      expect(arr).toEqual([12, 34, 56, 78]);
      expect(deletedElements).toEqual([90]);
    });

    it('should remove 3 elements', () => {
      const arr = [12, 34, 56, 78, 90];
      adjustSize(arr, 2, creator, deleter);

      expect(arr).toEqual([12, 34]);
      expect(deletedElements).toEqual([56, 78, 90]);
    });
  });

  describe('hexToRgb()', () => {
    it('should convert string with # to rgb', () => {
      const rgb = hexToRgb('#6b778c');
      expect(rgb).toEqual({
        red: 107,
        green: 119,
        blue: 140,
      });
    });
    it('should convert string without # to rgb', () => {
      const rgb = hexToRgb('6b778c');
      expect(rgb).toEqual({
        red: 107,
        green: 119,
        blue: 140,
      });
    });
  });

  describe('rgbToHex()', () => {
    it('should convert rgb to hashed hex', () => {
      const hashedHex = rgbToHex({
        red: 107,
        green: 119,
        blue: 140,
      });
      expect(hashedHex).toEqual('#6b778c');
    });
  });
});
