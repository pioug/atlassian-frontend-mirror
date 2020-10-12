describe('prepare', () => {
  const render = jest.fn();
  jest.doMock('../../render', () => ({ render }));

  const prefetch = jest.fn();
  jest.doMock('@atlaskit/atlassian-switcher/prefetch', () => ({ prefetch }));

  const { prepareAtlassianSwitcher } = require('../../prepare');
  beforeEach(() => {
    render.mockReset();
    prefetch.mockReset();
  });
  describe('bootstrap', () => {
    test('should throw if analytics listener is missing', () => {
      expect(() =>
        prepareAtlassianSwitcher({
          appearance: 'standalone',
          cloudId: 'some-cloud-id',
          disableCustomLinks: true,
          disableHeadings: true,
          disableRecentContainers: true,
          product: 'opsgenie',
        }),
      ).toThrow('Atlassian switcher: Missing analytics listener');
    });
  });

  describe('public api', () => {
    test('should return a render and prefetch method', () => {
      const analyticsListener = jest.fn();

      const switcher = prepareAtlassianSwitcher(
        {
          appearance: 'standalone',
          cloudId: 'some-cloud-id',
          disableCustomLinks: true,
          disableHeadings: true,
          disableRecentContainers: true,
          product: 'opsgenie',
        },
        analyticsListener,
      );

      expect(switcher.prefetch).toBeInstanceOf(Function);
      expect(switcher.renderAt).toBeInstanceOf(Function);
    });
  });

  describe('prefetching', () => {
    test('should pass down all the props to the prefetch method', () => {
      const analyticsListener = jest.fn();
      const props = {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        product: 'opsgenie',
      };

      const switcher = prepareAtlassianSwitcher(props, analyticsListener);

      switcher.prefetch();

      expect(prefetch).toHaveBeenCalledWith(props);
    });

    test('should not prefetch twice', () => {
      const analyticsListener = jest.fn();
      const props = {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        product: 'opsgenie',
      };

      const switcher = prepareAtlassianSwitcher(props, analyticsListener);

      switcher.prefetch();
      switcher.prefetch();
      switcher.prefetch();
      switcher.prefetch();
      switcher.prefetch();
      switcher.prefetch();

      expect(prefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('rendering', () => {
    test('should pass down all the props to the render method', () => {
      const analyticsListener = jest.fn();
      const props = {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        product: 'opsgenie',
      };

      const switcher = prepareAtlassianSwitcher(props, analyticsListener);

      const container = document.createElement('div');

      switcher.renderAt(container);

      expect(render).toHaveBeenCalledWith(props, analyticsListener, container);
    });
  });
});
