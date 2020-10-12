describe('utils/prefetch', () => {
  const prefetchAll = jest.fn();
  const prefetchAvailableProducts = jest.fn();
  const prefetchJoinableSites = jest.fn();
  const prefetchSwitcherBundles = jest.fn();

  jest.doMock('../../common/providers/instance-data-providers', () => ({
    prefetchAll,
  }));
  jest.doMock('../../common/providers/products-data-provider', () => ({
    prefetchAvailableProducts,
  }));
  jest.doMock(
    '../../cross-join/providers/joinable-sites-data-provider',
    () => ({
      prefetchJoinableSites,
    }),
  );
  jest.doMock(
    '../../common/utils/prefetch-bundles',
    () => prefetchSwitcherBundles,
  );

  const { prefetch } = require('../../prefetch');

  beforeEach(() => {
    prefetchAll.mockReset();
    prefetchAvailableProducts.mockReset();
    prefetchJoinableSites.mockReset();
    prefetchSwitcherBundles.mockReset();
  });

  it('should prefetch bundles', () => {
    const props = {
      product: 'any',
    };
    prefetch(props);
    expect(prefetchSwitcherBundles).toHaveBeenCalledTimes(1);
    expect(prefetchSwitcherBundles).toHaveBeenCalledWith('any');
  });

  it('should prefetch the data providers only if cloud id is passed down', () => {
    prefetch({});
    expect(prefetchAll).toHaveBeenCalledTimes(0);

    prefetch({
      cloudId: 'some-cloud-id',
    });

    expect(prefetchAll).toHaveBeenCalledTimes(1);

    expect(prefetchAll).toHaveBeenCalledWith({
      cloudId: 'some-cloud-id',
    });
  });

  it('should prefetch available products', () => {
    prefetch({});
    expect(prefetchAvailableProducts).toHaveBeenCalledTimes(1);
  });

  it('should prefetch joinable sites', () => {
    prefetch({});
    expect(prefetchJoinableSites).toHaveBeenCalledTimes(1);
  });
});
