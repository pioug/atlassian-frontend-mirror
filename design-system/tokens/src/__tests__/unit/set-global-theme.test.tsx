import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../../constants';
import setGlobalTheme from '../../set-global-theme';

describe('setGlobalTheme', () => {
  it('should apply light theme', () => {
    setGlobalTheme('light');
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(THEME_DATA_ATTRIBUTE, 'light');
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'light');
  });

  it('should apply dark theme', () => {
    setGlobalTheme('dark');
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(THEME_DATA_ATTRIBUTE, 'dark');
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'dark');
  });

  it('should apply light theme with system preference mode', () => {
    setGlobalTheme('light', true);
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(THEME_DATA_ATTRIBUTE, 'light');
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'auto');
  });

  it('should apply dark theme with system preference mode', () => {
    setGlobalTheme('dark', true);
    const htmlElement = document.getElementsByTagName('html')[0];
    expect(htmlElement).toHaveAttribute(THEME_DATA_ATTRIBUTE, 'dark');
    expect(htmlElement).toHaveAttribute(COLOR_MODE_ATTRIBUTE, 'auto');
  });

  it('should not apply arbitrary theme name', () => {
    // @ts-expect-error
    expect(() => setGlobalTheme('in-between')).toThrow();
  });
});
