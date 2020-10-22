import { SwitcherItemType } from '../../common/utils/links';
import {
  getDiscoverSectionLinks,
  getFixedProductLinks,
  getSuggestedProductLink,
} from './cross-flow-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import {
  Product,
  ProviderResults,
  SyntheticProviderResults,
  RecommendationsFeatureFlags,
} from '../../types';

export function collectDiscoverSectionLinks(
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
  isDiscoverMoreForEveryoneEnabled: boolean,
  isEmceeLinkEnabled: boolean,
  product?: Product,
  recommendationsFeatureFlags?: RecommendationsFeatureFlags,
) {
  const canManagePermission =
    !isError(managePermission) &&
    isComplete(managePermission) &&
    managePermission.data;

  const canAddProducts = Boolean(
    !isError(addProductsPermission) &&
      isComplete(addProductsPermission) &&
      addProductsPermission.data,
  );

  return getDiscoverSectionLinks({
    isDiscoverMoreForEveryoneEnabled,
    isEmceeLinkEnabled,
    product,
    canManagePermission,
    canAddProducts,
    recommendationsFeatureFlags,
  });
}

export function collectSuggestedLinks(
  provisionedProducts: SyntheticProviderResults['provisionedProducts'],
  productRecommendations: ProviderResults['productRecommendations'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
  joinableSites: ProviderResults['joinableSites'],
  features: {
    isDiscoverSectionEnabled?: boolean;
    isDefaultEditionFreeExperimentEnabled?: boolean;
    isMystiqueEnabled?: boolean;
  },
) {
  if (isError(isXFlowEnabled) || isError(provisionedProducts)) {
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
          features,
        )
      : [];
  }
}

export function collectFixedProductLinks(
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] {
  return getFixedProductLinks({
    isDiscoverMoreForEveryoneEnabled,
  });
}
