import { SwitcherItemType } from '../../common/utils/links';
import {
  getDiscoverSectionLinks,
  getFixedProductLinks,
  getSuggestedProductLink,
} from './cross-flow-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import {
  ProviderResults,
  SyntheticProviderResults,
  RecommendationsFeatureFlags,
  DiscoverMoreCallback,
} from '../../types';

export function collectDiscoverSectionLinks(
  recommendationsFeatureFlags?: RecommendationsFeatureFlags,
  isSlackDiscoveryEnabled?: boolean,
  slackDiscoveryClickHandler?: DiscoverMoreCallback,
) {
  return getDiscoverSectionLinks({
    recommendationsFeatureFlags,
    isSlackDiscoveryEnabled,
    slackDiscoveryClickHandler,
  });
}

export function collectSuggestedLinks(
  provisionedProducts: SyntheticProviderResults['provisionedProducts'],
  productRecommendations: ProviderResults['productRecommendations'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
  joinableSites: ProviderResults['joinableSites'],
) {
  if (
    isError(isXFlowEnabled) ||
    isError(joinableSites) ||
    isError(productRecommendations) ||
    isError(provisionedProducts)
  ) {
    return [];
  }
  if (
    isComplete(provisionedProducts) &&
    isComplete(isXFlowEnabled) &&
    isComplete(productRecommendations) &&
    isComplete(joinableSites)
  ) {
    return isXFlowEnabled.data
      ? getSuggestedProductLink(
          provisionedProducts.data,
          productRecommendations.data,
          joinableSites.data.sites,
        )
      : [];
  }
}

export function collectFixedProductLinks(): SwitcherItemType[] {
  return getFixedProductLinks({});
}
