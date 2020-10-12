describe('create-data-provider', () => {
  const fetchJson = jest.fn().mockReturnValue(Promise.resolve());
  const withCached = jest.fn().mockImplementation(fn => fn);

  jest.doMock('../../../utils/fetch', () => ({ fetchJson }));
  jest.doMock('../../../utils/with-cached', () => ({ withCached }));

  const {
    createProvider,
    createProviderWithCustomFetchData,
  } = require('../../create-data-provider');

  describe('createProvider', () => {
    test('should return a fetch method and a provider component', () => {
      const provider = createProvider('my-provider', '/gateway/api/content');
      expect(provider).toHaveProperty('fetchMethod');
      expect(provider).toHaveProperty('ProviderComponent');
    });

    test('should request data from the endpoint provided when the provider was created', () => {
      const providerA = createProvider(
        'my-provider-a',
        'http://my-api/content',
      );
      providerA.fetchMethod();

      expect(fetchJson).toBeCalledWith('http://my-api/content');

      const providerB = createProvider(
        'my-provider-a',
        '/gateway/my-api/content',
      );
      providerB.fetchMethod();

      expect(fetchJson).toBeCalledWith('/gateway/my-api/content');
    });
  });

  describe('createProviderWithCustomFetchData', () => {
    let fetchData: jest.Mock;

    beforeEach(() => {
      fetchData = jest.fn().mockResolvedValue(true);
    });

    test('should return a fetch method and a provider component', () => {
      const provider = createProviderWithCustomFetchData(
        'my-provider',
        fetchData,
      );
      expect(provider).toHaveProperty('fetchMethod');
      expect(provider).toHaveProperty('ProviderComponent');
    });

    test('should invoke the promise when the provider was created', () => {
      const provider = createProviderWithCustomFetchData(
        'my-provider',
        fetchData,
      );
      provider.fetchMethod();
      expect(fetchData).toBeCalled();
    });
  });
});
