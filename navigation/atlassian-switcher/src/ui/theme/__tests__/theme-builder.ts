import { createCustomTheme } from '../theme-builder';

describe('utils/theme-builder', () => {
  const noopThemeFn = () => ({});

  it('should export a theming function with Theme components for all the expected items', () => {
    expect(createCustomTheme({})).toHaveProperty('topLevelItemWrapperTheme');
    expect(createCustomTheme({})).toHaveProperty('itemTheme');
    expect(createCustomTheme({})).toHaveProperty('childItemTheme');
  });

  describe('creating a proper theme', () => {
    const blueColorScheme = {
      primaryTextColor: '#0000B2',
      secondaryTextColor: '#03396c',
      primaryHoverBackgroundColor: '#ccffff',
      secondaryHoverBackgroundColor: '#e5ffff',
    };

    const themes = createCustomTheme(blueColorScheme);

    it('topLevelItemWrapperTheme should match snapshot', () => {
      const itemTheme = themes.itemTheme(noopThemeFn, {});

      expect(itemTheme).toMatchSnapshot();
    });

    it('itemTheme should match snapshot', () => {
      const itemTheme = themes.itemTheme(noopThemeFn, {});

      expect(itemTheme).toMatchSnapshot();
    });

    it('childItemTheme should match snapshot', () => {
      const childItemTheme = themes.childItemTheme(noopThemeFn, {});

      expect(childItemTheme).toMatchSnapshot();
    });
  });

  describe('creating a theme without passing all the props will fallback to default', () => {
    const blueColorScheme = {
      primaryTextColor: '#0000B2',
      primaryHoverBackgroundColor: '#ccffff',
    };

    const themes = createCustomTheme(blueColorScheme);

    it('topLevelItemWrapperTheme should match snapshot', () => {
      const itemTheme = themes.itemTheme(noopThemeFn, {});

      expect(itemTheme).toMatchSnapshot();
    });

    it('itemTheme should match snapshot', () => {
      const itemTheme = themes.itemTheme(noopThemeFn, {});

      expect(itemTheme).toMatchSnapshot();
    });

    it('childItemTheme should match snapshot', () => {
      const childItemTheme = themes.childItemTheme(noopThemeFn, {});

      expect(childItemTheme).toMatchSnapshot();
    });
  });
});
