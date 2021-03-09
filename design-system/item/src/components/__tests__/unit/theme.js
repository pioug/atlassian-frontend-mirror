import {
  defaultTheme,
  themeWithKeys,
  getThemeStyle,
} from '../../../util/theme';

describe('@atlaskit/item - theme', () => {
  const themeWithChildAndParentKeys = { hover: { text: 'purple' } };
  const themeWithParentButNotChild = { hover: { blah: 'purple' } };

  describe('themeWithKeys', () => {
    it('should return default theme if no custom theme supplied', () => {
      expect(themeWithKeys(undefined, 'borderRadius')).toBe(defaultTheme);
      expect(themeWithKeys(undefined, 'text', 'hover')).toBe(defaultTheme);
    });

    it('should return default theme if theme supplied without key', () => {
      expect(themeWithKeys({}, 'borderRadius')).toBe(defaultTheme);
      expect(themeWithKeys({}, 'text', 'hover')).toBe(defaultTheme);
    });

    it('should return default theme if theme supplied parent key but not child key', () => {
      expect(themeWithKeys(themeWithParentButNotChild, 'text', 'hover')).toBe(
        defaultTheme,
      );
    });

    it('should return supplied theme if child key present and no parent key requested', () => {
      const themeWithChildKey = { borderRadius: 10 };
      expect(themeWithKeys(themeWithChildKey, 'borderRadius')).toBe(
        themeWithChildKey,
      );
    });

    it('should return supplied theme if child and parent keys present', () => {
      expect(themeWithKeys(themeWithChildAndParentKeys, 'text', 'hover')).toBe(
        themeWithChildAndParentKeys,
      );
    });
  });

  describe('getThemeStyle', () => {
    it('should return correct value if only child key is requested', () => {
      expect(getThemeStyle({ borderRadius: 99 }, 'borderRadius')).toBe(99);
    });

    it('should return correct value if parent and child keys are requested', () => {
      expect(getThemeStyle(themeWithChildAndParentKeys, 'text', 'hover')).toBe(
        'purple',
      );
    });

    it('should fall back to default theme value if theme missing key', () => {
      expect(getThemeStyle(themeWithParentButNotChild, 'text', 'hover')).toBe(
        defaultTheme.hover.text,
      );
      expect(getThemeStyle({}, 'borderRadius')).toBe(defaultTheme.borderRadius);
    });

    it('should return correct value for some falsy values', () => {
      expect(getThemeStyle({ borderRadius: 0 }, 'borderRadius')).toBe(0);
      expect(getThemeStyle({ borderRadius: false }, 'borderRadius')).toBe(
        false,
      );
      expect(getThemeStyle({ borderRadius: '' }, 'borderRadius')).toBe(
        defaultTheme.borderRadius,
      );
      expect(getThemeStyle({ borderRadius: undefined }, 'borderRadius')).toBe(
        defaultTheme.borderRadius,
      );
      expect(getThemeStyle({ borderRadius: null }, 'borderRadius')).toBe(
        defaultTheme.borderRadius,
      );
    });
  });
});
