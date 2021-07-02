import setGlobalTheme from '../../set-global-theme';

describe('setGlobalTheme', () => {
  it('should apply light theme', () => {
    setGlobalTheme('light');
    expect(document.getElementsByTagName('html')[0]).toHaveAttribute(
      'data-theme',
      'light',
    );
  });

  it('should apply dark theme', () => {
    setGlobalTheme('dark');
    expect(document.getElementsByTagName('html')[0]).toHaveAttribute(
      'data-theme',
      'dark',
    );
  });

  it('should not apply arbitrary theme name', () => {
    // @ts-expect-error
    expect(() => setGlobalTheme('in-between')).toThrow();
  });
});
