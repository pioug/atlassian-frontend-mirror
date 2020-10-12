import {
  convertHexShorthand,
  generateTextColor,
} from '../../../theme/themeHelpers';

describe('theme helpers', () => {
  describe('generateTextColor', () => {
    it('returns correct text color for hex shorthand', () => {
      const color = '#fff';
      const textColor = generateTextColor(color);
      expect(textColor).toEqual('#000000');
    });

    it('returns correct text color for hex', () => {
      const color = '#ffffff';
      const textColor = generateTextColor(color);
      expect(textColor).toEqual('#000000');
    });

    it('returns correct text color for rgb', () => {
      const color = 'rgb(255, 255, 255)';
      const textColor = generateTextColor(color);
      expect(textColor).toEqual('#000000');
    });
  });

  describe('convert hex value', () => {
    it('returns hex value when not shorthand', () => {
      const color = '#cccccc';
      const converted = convertHexShorthand(color);
      expect(converted).toEqual(color);
    });

    it('returns other color notion when not shorthand', () => {
      const color = 'rbg(10, 20, 30)';
      const converted = convertHexShorthand(color);
      expect(converted).toEqual(color);
    });

    it('returns complete hex value for triplets', () => {
      const color = '#ccc';
      const converted = convertHexShorthand(color);
      expect(converted).toEqual('#cccccc');
    });

    it('returns complete hex value for triplets', () => {
      const color = '#DDD';
      const converted = convertHexShorthand(color);
      expect(converted).toEqual('#DDDDDD');
    });

    it('returns complete hex value for 2 characters shorthand', () => {
      const color = '#0fc';
      const converted = convertHexShorthand(color);
      expect(converted).toEqual('#00ffcc');
    });
  });
});
