import { filterSiteProducts } from '.';
import { AvailableSitesProductType } from '@atlaskit/linking-common/types';

describe('filter site products', () => {
  it('can filter out site by the specified products', () => {
    const products = [AvailableSitesProductType.CONFLUENCE];
    const siteWithSpecifiedProduct = {
      avatarUrl: 'http://example.com/avatarUrl',
      cloudId: 'test-cloudid',
      displayName: 'test-displayName',
      isVertigo: false,
      products: [
        AvailableSitesProductType.CONFLUENCE,
        AvailableSitesProductType.JIRA_SOFTWARE,
      ],
      url: 'http://example.com',
    };

    const resultWithSpecifiedProduct = filterSiteProducts(products)(
      siteWithSpecifiedProduct,
    );

    expect(resultWithSpecifiedProduct).toStrictEqual(true);

    const siteWithoutSpecifiedProduct = {
      avatarUrl: 'http://example.com/avatarUrl',
      cloudId: 'test-cloudid',
      displayName: 'test-displayName',
      isVertigo: false,
      products: [AvailableSitesProductType.JIRA_SOFTWARE],
      url: 'http://example.com',
    };
    const resultWithoutSpecifiedProduct = filterSiteProducts(products)(
      siteWithoutSpecifiedProduct,
    );

    expect(resultWithoutSpecifiedProduct).toStrictEqual(false);
  });
});
