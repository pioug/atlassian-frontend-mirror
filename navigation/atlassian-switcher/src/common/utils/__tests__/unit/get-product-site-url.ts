import { AvailableProduct, SwitcherProductType } from '../../../../types';
import {
  AVAILABLE_PRODUCT_DATA_MAP,
  getProductSiteUrl,
  ConnectedSite,
} from '../../links';

const siteUrl = 'https://test.atlassian.net';
const externalUrl = 'foo.com';

const tenantedProducts = [
  SwitcherProductType.JIRA_SOFTWARE,
  SwitcherProductType.JIRA_BUSINESS,
  SwitcherProductType.JIRA_SERVICE_DESK,
  SwitcherProductType.CONFLUENCE,
  SwitcherProductType.BITBUCKET,
];

const getConnectedSiteInfo = (
  productType: SwitcherProductType,
): ConnectedSite => ({
  avatar: null,
  product: {
    productType,
    url: externalUrl,
  } as AvailableProduct,
  isCurrentSite: false,
  siteName: 'test',
  siteUrl,
});

describe('getProductSiteUrl', () => {
  it('should return a site url with Available Product Data Map href for tenanted products', () => {
    for (const product of tenantedProducts) {
      expect(getProductSiteUrl(getConnectedSiteInfo(product))).toEqual(
        `${siteUrl}${AVAILABLE_PRODUCT_DATA_MAP[product].href}`,
      );
    }
  });

  it('should return the product url from the connected site info for Opsgenie, Statuspage, Trello and Team Central', () => {
    const productsWithUrl = [
      SwitcherProductType.OPSGENIE,
      SwitcherProductType.STATUSPAGE,
      SwitcherProductType.TRELLO,
      SwitcherProductType.TEAM_CENTRAL,
    ];
    for (const product of productsWithUrl) {
      expect(getProductSiteUrl(getConnectedSiteInfo(product))).toEqual(
        externalUrl,
      );
    }
  });
});
