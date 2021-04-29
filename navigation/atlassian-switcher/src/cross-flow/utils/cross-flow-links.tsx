import React from 'react';
import FormattedMessage from '../../ui/primitives/formatted-message';
import AddIcon from '@atlaskit/icon/glyph/add';
import { createIcon } from '../../common/utils/icon-themes';
import messages from '../../common/utils/messages';
import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import CodeIcon from '@atlaskit/icon/glyph/code';
import {
  Product,
  ProvisionedProducts,
  RecommendationsEngineResponse,
  JoinableSite,
  SwitcherProductType,
  RecommendationsFeatureFlags,
  DiscoverLinkItemKeys,
  DiscoverMoreCallback,
} from '../../types';
import {
  AVAILABLE_PRODUCT_DATA_MAP,
  TO_SWITCHER_PRODUCT_KEY,
  SwitcherItemType,
  getEmceeLink,
} from '../../common/utils/links';
import SlackIcon from '../../ui/primitives/SlackIcon';

export const getFixedProductLinks = (params: {}): SwitcherItemType[] => {
  return [getDiscoverMoreLink()];
};

const getDiscoverMoreLink = (
  customIcon?: React.ComponentType<any>,
  isSlackDiscoveryEnabled?: boolean,
): SwitcherItemType => {
  const icon = customIcon || AddIcon;
  return {
    // The discover more link href is intentionally empty to prioritise the onDiscoverMoreClicked callback
    key: DiscoverLinkItemKeys.DISCOVER_MORE,
    label: (
      <FormattedMessage
        {...(isSlackDiscoveryEnabled
          ? messages.moreProductsLink
          : messages.moreAtlassianProductsLink)}
      />
    ),
    Icon: createIcon(icon, { size: 'medium' }),
    href: '',
  };
};

const getGitToolsLink = (): SwitcherItemType => {
  const icon = CodeIcon;
  return {
    key: DiscoverLinkItemKeys.GIT_TOOLS,
    label: <FormattedMessage {...messages.gitToolsLabel} />,
    description: <FormattedMessage {...messages.gitToolsDescription} />,
    Icon: createIcon(icon, { size: 'medium' }),
    href: '',
  };
};

const getSlackIntegrationLink = (): SwitcherItemType => ({
  // The Slack integration link href is intentionally empty to prioritise the slackDiscoveryClickHandler callback
  key: DiscoverLinkItemKeys.SLACK_INTEGRATION,
  label: <FormattedMessage {...messages.slackIntegrationLink} />,
  Icon: createIcon(SlackIcon, { size: 'medium' }),
  href: '',
});

export function getDiscoverSectionLinks({
  isEmceeLinkEnabled,
  product,
  canManagePermission,
  canAddProducts,
  recommendationsFeatureFlags,
  isSlackDiscoveryEnabled,
  slackDiscoveryClickHandler,
}: {
  isEmceeLinkEnabled: boolean;
  product?: Product;
  canManagePermission: boolean;
  canAddProducts: boolean;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  isSlackDiscoveryEnabled?: boolean;
  slackDiscoveryClickHandler?: DiscoverMoreCallback;
}) {
  const discoverLinks: SwitcherItemType[] = [];
  const discoverMoreLink = getDiscoverMoreLink(
    DiscoverFilledGlyph,
    isSlackDiscoveryEnabled && Boolean(slackDiscoveryClickHandler),
  );

  const slackIntegrationLink = getSlackIntegrationLink();

  const emceeLink =
    (canManagePermission || canAddProducts) &&
    isEmceeLinkEnabled &&
    getEmceeLink(product);

  const gitToolsLink =
    recommendationsFeatureFlags &&
    // recommendationsFeatureFlags[Feature.showGitTools] &&
    recommendationsFeatureFlags[DiscoverLinkItemKeys.GIT_TOOLS] &&
    getGitToolsLink();

  if (gitToolsLink) {
    discoverLinks.push(gitToolsLink);
  }
  if (isSlackDiscoveryEnabled && Boolean(slackDiscoveryClickHandler)) {
    discoverLinks.push(slackIntegrationLink);
  }

  if (discoverMoreLink) {
    discoverLinks.push(discoverMoreLink);
  }

  if (emceeLink) {
    discoverLinks.push(emceeLink);
  }

  return discoverLinks;
}

export const getSuggestedProductLink = (
  provisionedProducts: ProvisionedProducts,
  productRecommendations: RecommendationsEngineResponse,
  joinableSites: JoinableSite[],
  features?: {
    isDiscoverSectionEnabled?: boolean;
  },
): SwitcherItemType[] => {
  const collectedJoinableSites = Object.keys(
    collectJoinableSites(joinableSites),
  );

  return productRecommendations
    .filter(legacyProduct => {
      const productKey = TO_SWITCHER_PRODUCT_KEY[legacyProduct.productKey];

      const shouldHideOpsGenie =
        productKey === SwitcherProductType.OPSGENIE &&
        provisionedProducts[SwitcherProductType.JIRA_SERVICE_DESK];

      return !(
        provisionedProducts[productKey] ||
        collectedJoinableSites.includes(legacyProduct.productKey) ||
        shouldHideOpsGenie
      );
    })
    .map(legacyProduct => {
      const switcherProductKey =
        TO_SWITCHER_PRODUCT_KEY[legacyProduct.productKey];

      return {
        key: legacyProduct.productKey,
        ...AVAILABLE_PRODUCT_DATA_MAP[switcherProductKey],
      };
    })
    .slice(
      0,
      features?.isDiscoverSectionEnabled
        ? DISCOVER_PRODUCT_RECOMMENDATION_LIMIT
        : PRODUCT_RECOMMENDATION_LIMIT,
    );
};

const PRODUCT_RECOMMENDATION_LIMIT = 2;
const DISCOVER_PRODUCT_RECOMMENDATION_LIMIT = 3;

const collectJoinableSites = (joinableSites: JoinableSite[]) =>
  joinableSites.reduce(
    (joinable, sites) => ({ ...joinable, ...(sites.products || sites.users) }),
    {},
  );
