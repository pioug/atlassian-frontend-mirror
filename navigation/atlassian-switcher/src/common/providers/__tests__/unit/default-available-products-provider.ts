describe('default-available-products-provider', () => {
  const fetchJson = jest.fn();

  jest.doMock('../../../utils/fetch', () => ({
    fetchJson,
  }));

  test('should create a provider whose fetchJson calls (/gateway) by default', () => {
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    const { fetchMethod } = createAvailableProductsProvider();
    fetchMethod();
    expect(fetchJson).toBeCalledWith(
      '/gateway/api/available-products/api/available-products',
    );
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    const { fetchMethod } = createAvailableProductsProvider(
      'http://my-api/api/content',
    );
    fetchMethod();
    expect(fetchJson).toBeCalledWith('http://my-api/api/content');
  });

  test('should return empty sites when querying experiment-api fetchJson returns 401', async () => {
    fetchJson.mockImplementationOnce(() => Promise.reject({ status: 401 }));
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    const { fetchMethod } = createAvailableProductsProvider(
      'http://my-api/experiment-api/content',
    );
    const expectedResult = await fetchMethod();
    expect(expectedResult).toEqual({ sites: [], isPartial: false });
  });

  test('should return a normal 401 when fetchJson returns 401 and not hitting experiment-api', async () => {
    fetchJson.mockImplementationOnce(() => Promise.reject({ status: 401 }));
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    const { fetchMethod } = createAvailableProductsProvider(
      'http://my-api/api/content',
    );
    try {
      await fetchMethod();
    } catch (e) {
      expect(e).toEqual({ status: 401 });
    }
  });

  test('should return an error when fetchJson returns 403 (user unverified)', async () => {
    fetchJson.mockImplementationOnce(() => Promise.reject({ status: 403 }));
    const {
      createAvailableProductsProvider,
    } = require('../../default-available-products-provider');
    const { fetchMethod } = createAvailableProductsProvider(
      'http://my-api/api/content',
    );
    try {
      await fetchMethod();
    } catch (e) {
      expect(e).toEqual({ status: 403 });
    }
  });

  afterEach(fetchJson.mockClear);
});
