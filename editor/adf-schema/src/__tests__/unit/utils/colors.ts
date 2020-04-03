import { hexToRgba, isRgb, normalizeHexColor } from '../../../utils/colors';

describe('@atlaskit/editor-core color utils', () => {
  describe('hex2rgba', () => {
    it('converts short hex to rgba', () => {
      expect(hexToRgba('#fab', 0.5)).toEqual('rgba(255,170,187,0.5)');
    });

    it('converts long hex to rgba', () => {
      expect(hexToRgba('#ffaabb', 0.5)).toEqual('rgba(255,170,187,0.5)');
    });
  });

  describe('isRgb', () => {
    it('returns truthy for rgb', () => {
      expect(isRgb('rgb(0, 0, 0)')).toBeTruthy();
    });

    it('returns truthy for rgba', () => {
      expect(isRgb('rgba(0, 0, 0, 0)')).toBeTruthy();
    });

    it('returns falsy for hex', () => {
      expect(isRgb('#FFFFFF')).toBeFalsy();
    });

    it('returns falsy for random string', () => {
      expect(isRgb('rgab(00')).toBeFalsy();
    });
  });

  describe('normalizeHexColor', () => {
    it('return hex color of a color name', () => {
      expect(normalizeHexColor('red')).toEqual('#ff0000');
    });
  });
});
