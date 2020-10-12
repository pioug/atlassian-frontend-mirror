const loadAtlassianSwitcher = jest.fn();
const loadJiraSwitcher = jest.fn();
const loadConfluenceSwitcher = jest.fn();
const loadGenericSwitcher = jest.fn();

jest.doMock('../../../../ui/components/loaders', () => ({
  loadAtlassianSwitcher,
  loadJiraSwitcher,
  loadConfluenceSwitcher,
  loadGenericSwitcher,
}));

const prefetchBundles = require('../../prefetch-bundles').default;

describe('prefetch-bundles', () => {
  beforeEach(() => {
    loadAtlassianSwitcher.mockReset();
    loadJiraSwitcher.mockReset();
    loadConfluenceSwitcher.mockReset();
    loadGenericSwitcher.mockReset();
  });

  describe('should preload atlassian-switcher bundle and the product specific switcher bundle if specified', () => {
    test('jira uses jira-swicther', () => {
      prefetchBundles('jira');

      expect(loadAtlassianSwitcher).toHaveBeenCalledTimes(1);
      expect(loadJiraSwitcher).toHaveBeenCalledTimes(1);
      expect(loadConfluenceSwitcher).toHaveBeenCalledTimes(0);
      expect(loadGenericSwitcher).toHaveBeenCalledTimes(0);
    });

    test('confluence uses confluence-switcher', () => {
      prefetchBundles('confluence');

      expect(loadAtlassianSwitcher).toHaveBeenCalledTimes(1);
      expect(loadJiraSwitcher).toHaveBeenCalledTimes(0);
      expect(loadConfluenceSwitcher).toHaveBeenCalledTimes(1);
      expect(loadGenericSwitcher).toHaveBeenCalledTimes(0);
    });

    test('trello uses generic switcher', () => {
      prefetchBundles('trello');

      expect(loadAtlassianSwitcher).toHaveBeenCalledTimes(1);
      expect(loadJiraSwitcher).toHaveBeenCalledTimes(0);
      expect(loadConfluenceSwitcher).toHaveBeenCalledTimes(0);
      expect(loadGenericSwitcher).toHaveBeenCalledTimes(1);
    });

    test('opsgenie uses generic switcher', () => {
      prefetchBundles('opsgenie');

      expect(loadAtlassianSwitcher).toHaveBeenCalledTimes(1);
      expect(loadJiraSwitcher).toHaveBeenCalledTimes(0);
      expect(loadConfluenceSwitcher).toHaveBeenCalledTimes(0);
      expect(loadGenericSwitcher).toHaveBeenCalledTimes(1);
    });

    test('if product is not provided, uses generic switcher', () => {
      prefetchBundles();

      expect(loadAtlassianSwitcher).toHaveBeenCalledTimes(1);
      expect(loadJiraSwitcher).toHaveBeenCalledTimes(0);
      expect(loadConfluenceSwitcher).toHaveBeenCalledTimes(0);
      expect(loadGenericSwitcher).toHaveBeenCalledTimes(1);
    });
  });
});
