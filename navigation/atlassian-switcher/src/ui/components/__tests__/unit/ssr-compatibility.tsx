/*
 * AtlassianSwitcher does not intend to work with SSR, but to prevent
 * other dependant packages from blowing up we need to test that AtlassianSwitcher
 * could be safely imported in `node` environment
 */
describe('Atlassian Switcher - SSR', () => {
  it('should not break when importing AtlassianSwitcher package', () => {
    expect(() => {
      require('../../atlassian-switcher').default;
    }).not.toThrowError();
  });
});
