describe('default-joinabble-sites-provider', () => {
  const createProviderWithCustomFetchData = jest.fn();

  jest.doMock('../../../../common/providers/create-data-provider', () => ({
    createProviderWithCustomFetchData,
  }));

  test('should create a provider (returns empty sites) by default', () => {
    const {
      createJoinableSitesProvider,
    } = require('../../default-joinable-sites-provider');
    createJoinableSitesProvider();
    expect(createProviderWithCustomFetchData).toBeCalledWith(
      'joinableSites',
      expect.any(Function),
    );
  });

  test('should allow to create a provider with custom endpoint url', () => {
    const {
      createJoinableSitesProvider,
    } = require('../../default-joinable-sites-provider');
    const promise = () =>
      new Promise(resolve => ({
        sites: [],
      }));
    createJoinableSitesProvider(promise);
    expect(createProviderWithCustomFetchData).toBeCalledWith(
      'joinableSites',
      expect.any(Function),
    );
  });
});
