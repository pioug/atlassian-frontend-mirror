import { ReactElement } from 'react';
import messages from '../../../../common/utils/messages';
import {
  getFixedProductLinks,
  getSuggestedProductLink,
  getDiscoverSectionLinks,
} from '../../cross-flow-links';
import {
  ProvisionedProducts,
  ProductKey,
  SwitcherProductType,
  JoinableSite,
  Product,
} from '../../../../types';

import { resolveRecommendations } from '../../../../cross-flow/providers/recommendations';
import { SHOW_GIT_TOOLS_KEY } from '../../../../cross-flow/providers/recommendations/constants';

import mockJoinableSites from '../../../../../test-helpers/mockJoinableSites';

const generateProvisionedProducts = (
  activeProducts: SwitcherProductType[],
): ProvisionedProducts =>
  activeProducts.reduce(
    (acc, product) => ({
      ...acc,
      [product]: true,
    }),
    {},
  );

describe('cross-flow-links', () => {
  describe('fixed product links', () => {
    it('should have discover more button if enabled', () => {
      const expectedProducts = ['discover-more'];
      const fixedLinks = getFixedProductLinks({});
      expect(fixedLinks.map(({ key }) => key)).toMatchObject(expectedProducts);
    });
  });

  describe('getXSellLink', () => {
    const suggestedProducts = resolveRecommendations();
    it('should offer both JSW and Confluence if no products are active', () => {
      const provisionedProducts = generateProvisionedProducts([]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should offer both JSW and JSM if Confluence is active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer both Confluence and JSM if JSW is active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer JSM and Opsgenie if Confluence and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SOFTWARE,
        SwitcherProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result.length).toEqual(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
      expect(result[1]).toHaveProperty('key', ProductKey.OPSGENIE);
    });
    it('should offer Confluence if JSW and JSM are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SOFTWARE,
        SwitcherProductType.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should return JSW if Confluence and JSM are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SERVICE_DESK,
        SwitcherProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
    });
    it('should return an empty array if Confluence, JSM and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SERVICE_DESK,
        SwitcherProductType.CONFLUENCE,
        SwitcherProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result).toHaveLength(0);
    });

    it('should return an empty array if Confluence, JSM, JSW, and Opsgenie are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SERVICE_DESK,
        SwitcherProductType.CONFLUENCE,
        SwitcherProductType.JIRA_SOFTWARE,
        SwitcherProductType.OPSGENIE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(result).toHaveLength(0);
    });

    it('should return only sites that are not joinable', () => {
      const joinableMockData = [
        ProductKey.CONFLUENCE,
        ProductKey.JIRA_SOFTWARE,
      ].map((productKey: ProductKey, index) => {
        const productData = mockJoinableSites.sites[index] as JoinableSite;
        return { ...productData };
      });

      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.CONFLUENCE,
      ]);

      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        joinableMockData,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
      expect(result[1]).toHaveProperty('key', ProductKey.OPSGENIE);
    });

    it('should not return Opsgenie if JSM is active', () => {
      const provisionedProducts = generateProvisionedProducts([
        SwitcherProductType.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
        [],
      );
      expect(
        result.filter(product => product.key === ProductKey.OPSGENIE),
      ).toHaveLength(0);
    });
  });

  describe('getDiscoverSectionLinks', () => {
    const mockClickHandler = jest.fn();
    it('should return git tools link', () => {
      const result = getDiscoverSectionLinks({
        isEmceeLinkEnabled: true,
        product: Product.BITBUCKET,
        canManagePermission: true,
        canAddProducts: true,
        recommendationsFeatureFlags: {
          [SHOW_GIT_TOOLS_KEY]: true,
        },
      });

      expect(
        result.filter(link => link.key === SHOW_GIT_TOOLS_KEY),
      ).toHaveLength(1);
    });

    it('should not return git tools link', () => {
      const result = getDiscoverSectionLinks({
        isEmceeLinkEnabled: true,
        product: Product.BITBUCKET,
        canManagePermission: true,
        canAddProducts: true,
        recommendationsFeatureFlags: {
          [SHOW_GIT_TOOLS_KEY]: false,
        },
      });

      expect(
        result.filter(link => link.key === SHOW_GIT_TOOLS_KEY),
      ).toHaveLength(0);
    });
    it('should have a different label for `discover-more` link if isSlackDiscoveryEnabled enabled', () => {
      const result = getDiscoverSectionLinks({
        isSlackDiscoveryEnabled: true,
        slackDiscoveryClickHandler: mockClickHandler,
        isEmceeLinkEnabled: true,
        product: Product.CONFLUENCE,
        canManagePermission: true,
        canAddProducts: true,
      });

      const discoverMore = result.filter(link => link.key === 'discover-more');
      const discoverMoreLabel = discoverMore[0]?.label as ReactElement;

      expect(discoverMoreLabel.props.defaultMessage).toEqual(
        messages.moreProductsLink.defaultMessage,
      );
    });
    it('should return slack integration link if isSlackDiscoveryEnabled enabled', () => {
      const result = getDiscoverSectionLinks({
        isSlackDiscoveryEnabled: true,
        slackDiscoveryClickHandler: mockClickHandler,
        product: Product.CONFLUENCE,
        isEmceeLinkEnabled: true,
        canManagePermission: true,
        canAddProducts: true,
      });

      expect(
        result.filter(link => link.key === 'slack-integration'),
      ).toHaveLength(1);
    });
  });
});
