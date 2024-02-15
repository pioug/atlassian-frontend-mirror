import { isRawColor } from '../lib/colors';
import { splitCssValue } from '../lib/declaration';

describe('Utils', () => {
  describe('splitCssValue', () => {
    describe('Handling simple CSS values', () => {
      it('should split a simple CSS value correctly', () => {
        const result = splitCssValue('red blue');
        expect(result).toEqual(['red', 'blue']);
      });

      it('should handle multiple spaces correctly', () => {
        const result = splitCssValue('red   blue');
        expect(result).toEqual(['red', 'blue']);
      });

      it('should handle CSS values with special characters correctly', () => {
        const result = splitCssValue('1px solid #000');
        expect(result).toEqual(['1px', 'solid', '#000']);
      });
    });

    describe('Handling CSS functions', () => {
      it('should split a CSS value with a function correctly', () => {
        const result = splitCssValue('linear-gradient(red, blue)');
        expect(result).toEqual(['linear-gradient(red, blue)']);
      });

      it('should handle CSS values with commas correctly', () => {
        const result = splitCssValue('rgba(255, 255, 255, 0.6)');
        expect(result).toEqual(['rgba(255, 255, 255, 0.6)']);
      });

      it('should handle CSS values with multiple functions correctly', () => {
        const result = splitCssValue('linear-gradient(red, blue) no-repeat');
        expect(result).toEqual(['linear-gradient(red, blue)', 'no-repeat']);
      });

      it('should handle less functions correctly', () => {
        const result = splitCssValue('darken(#000, 10%)');
        expect(result).toEqual(['darken(#000, 10%)']);
      });

      it('should handle CSS url() function correctly', () => {
        const result = splitCssValue('url(http://example.com/image.jpg)');
        expect(result).toEqual(['url(http://example.com/image.jpg)']);
      });

      it('should handle multiple CSS functions correctly', () => {
        const result = splitCssValue(
          'linear-gradient(red, blue) url(http://example.com/image.jpg)',
        );
        expect(result).toEqual([
          'linear-gradient(red, blue)',
          'url(http://example.com/image.jpg)',
        ]);
      });

      it('should handle CSS functions with nested functions correctly', () => {
        const result = splitCssValue(
          'linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(0, 255, 0, 0.5))',
        );
        expect(result).toEqual([
          'linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(0, 255, 0, 0.5))',
        ]);
      });
    });

    describe('Handling edge cases', () => {
      it('should return null for an empty string', () => {
        const result = splitCssValue('');
        expect(result).toBeNull();
      });

      it('should handle no spaces between commas correctly', () => {
        const result = splitCssValue('rgba(255,255,255,0.6)');
        expect(result).toEqual(['rgba(255,255,255,0.6)']);
      });

      it('should handle extra spaces around commas correctly', () => {
        const result = splitCssValue('rgba(255 ,  255 , 255 , 0.6)');
        expect(result).toEqual(['rgba(255 ,  255 , 255 , 0.6)']);
      });

      it('should handle other whitespace characters correctly', () => {
        const result = splitCssValue('red\tblue\nblack');
        expect(result).toEqual(['red', 'blue', 'black']);
      });

      it('should handle CSS values with exclamation mark correctly', () => {
        const result = splitCssValue('color: red !important');
        expect(result).toEqual(['color:', 'red', '!important']);
      });

      it('should ignore leading and trailing spaces', () => {
        const result = splitCssValue('  red blue  ');
        expect(result).toEqual(['red', 'blue']);
      });
    });
  });

  describe('isRawColor', () => {
    it('should return true for valid raw color values', () => {
      expect(isRawColor('#fff')).toBe(true);
      expect(isRawColor('#ffffff')).toBe(true);
      expect(isRawColor('rgb(255, 255, 255)')).toBe(true);
      expect(isRawColor('rgba(255, 255, 255, 1)')).toBe(true);
      expect(isRawColor('hsl(120, 100%, 50%)')).toBe(true);
      expect(isRawColor('hsla(120, 100%, 50%, 0.3)')).toBe(true);
    });

    it('should return false for invalid raw color values', () => {
      expect(isRawColor('#ggg')).toBe(false);
      expect(isRawColor('rgb(255, 255)')).toBe(false);
      expect(isRawColor('rgba(255, 255, 255)')).toBe(false);
      expect(isRawColor('hsl(120, 100%)')).toBe(false);
      expect(isRawColor('hsla(120, 100%, 50%)')).toBe(false);
    });

    it('should return false for CSS variables', () => {
      expect(isRawColor('var(--main-color)')).toBe(false);
    });

    it('should return true for valid raw color values with leading spaces', () => {
      expect(isRawColor(' #fff')).toBe(true);
      expect(isRawColor(' rgba(255, 255, 255, 1)')).toBe(true);
    });

    it('should return true for valid raw color values with multiple spaces', () => {
      expect(isRawColor('rgb(255,   255,   255)')).toBe(true);
      expect(isRawColor('rgba(255,   255,   255,   1)')).toBe(true);
    });

    it('should return true for valid raw color values with any number for the alpha channel', () => {
      expect(isRawColor('rgba(255, 255, 255, 5)')).toBe(true);
      expect(isRawColor('rgba(255, 255, 255, -1)')).toBe(true);
    });

    it('should return true for less often used color formats', () => {
      expect(isRawColor('lab(50% 0 0)')).toBe(true);
      expect(isRawColor('lch(50% 0 0)')).toBe(true);
      expect(isRawColor('hwb(0 0% 0%)')).toBe(true);
    });
  });
});
