import {
  ProductKey,
  RecommendationItem,
  RecommendationsFeatureFlags,
} from '../../../types';

import {
  upaasExperiment,
  productStoreRecommendation,
  productStoreInTrelloRecommendation,
  productStoreInTrelloJSWFirstRecommendation,
  productStoreInTrelloConfluenceFirstRecommendation,
} from './experiments';

function baseRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function resolveRecommendations(
  featureFlags?: RecommendationsFeatureFlags,
): RecommendationItem[] {
  if (!featureFlags) {
    return baseRecommendation();
  }

  if (
    upaasExperiment.showFeatureFlagVariation(
      featureFlags[upaasExperiment.flagKey],
    )
  ) {
    const flagValue = featureFlags[upaasExperiment.flagKey];
    return upaasExperiment.recommendations(flagValue);
  }

  if (featureFlags.isProductStoreInTrelloJSWFirstEnabled) {
    return productStoreInTrelloJSWFirstRecommendation();
  }

  if (featureFlags.isProductStoreInTrelloConfluenceFirstEnabled) {
    return productStoreInTrelloConfluenceFirstRecommendation();
  }

  if (featureFlags.isProductStoreInTrelloEnabled) {
    return productStoreInTrelloRecommendation();
  }

  return productStoreRecommendation();
}
