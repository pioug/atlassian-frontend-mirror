import React from 'react';
import FormattedMessage from '../../ui/primitives/formatted-message';
import AddIcon from '@atlaskit/icon/glyph/add';
import { createIcon } from '../../common/utils/icon-themes';
import messages from '../../common/utils/messages';
import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import {
  Product,
  ProvisionedProducts,
  RecommendationsEngineResponse,
  JoinableSite,
  SwitcherProductType,
} from '../../types';
import {
  AVAILABLE_PRODUCT_DATA_MAP,
  FREE_EDITION_AVAILABLE_PRODUCT_DATA_MAP,
  TO_SWITCHER_PRODUCT_KEY,
  SwitcherItemType,
  getEmceeLink,
} from '../../common/utils/links';
import { mapLegacyProductTypeToSwitcherType } from '../../common/utils/map-to-switcher-props-with-mystique-ff';

export const getFixedProductLinks = (params: {
  isDiscoverMoreForEveryoneEnabled: boolean;
}): SwitcherItemType[] => {
  return params.isDiscoverMoreForEveryoneEnabled ? [getDiscoverMoreLink()] : [];
};

const getDiscoverMoreLink = (
  customIcon?: React.ComponentType<any>,
): SwitcherItemType => {
  const icon = customIcon || AddIcon;
  return {
    // The discover more link href is intentionally empty to prioritise the onDiscoverMoreClicked callback
    key: 'discover-more',
    label: <FormattedMessage {...messages.discoverMore} />,
    Icon: createIcon(icon, { size: 'medium' }),
    href: '',
  };
};

export function getDiscoverSectionLinks({
  isDiscoverMoreForEveryoneEnabled,
  isEmceeLinkEnabled,
  product,
  canManagePermission,
  canAddProducts,
}: {
  isDiscoverMoreForEveryoneEnabled: boolean;
  isEmceeLinkEnabled: boolean;
  product?: Product;
  canManagePermission: boolean;
  canAddProducts: boolean;
}) {
  const discoverLinks: SwitcherItemType[] = [];
  const discoverMoreLink =
    isDiscoverMoreForEveryoneEnabled &&
    getDiscoverMoreLink(DiscoverFilledGlyph);

  const emceeLink =
    (canManagePermission || canAddProducts) &&
    isEmceeLinkEnabled &&
    getEmceeLink(product);

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
    isDefaultEditionFreeExperimentEnabled?: boolean;
    isMystiqueEnabled?: boolean;
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
        features?.isMystiqueEnabled &&
        provisionedProducts[SwitcherProductType.JIRA_SERVICE_DESK];

      return !(
        provisionedProducts[productKey] ||
        collectedJoinableSites.includes(legacyProduct.productKey) ||
        shouldHideOpsGenie
      );
    })
    .map(legacyProduct => {
      const switcherProductKey = mapLegacyProductTypeToSwitcherType(
        legacyProduct.productKey,
        features?.isMystiqueEnabled,
      );
      return features?.isDefaultEditionFreeExperimentEnabled
        ? {
            key: legacyProduct.productKey,
            ...FREE_EDITION_AVAILABLE_PRODUCT_DATA_MAP[switcherProductKey],
          }
        : {
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
