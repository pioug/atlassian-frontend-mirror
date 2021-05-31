import { ProductKey, RecommendationItem } from '../../../types';

import {
  UPAAS_EXPERIMENT_FEATURE_FLAG_KEY,
  UPAAS_EXPERIMENT_VARIATIONS,
} from './constants';

function showFeatureFlagVariationForUPaas(
  featureFlagValue: string | boolean,
): boolean {
  if (typeof featureFlagValue !== 'string') {
    return false;
  }

  if (UPAAS_EXPERIMENT_VARIATIONS.includes(featureFlagValue)) {
    return true;
  }

  return false;
}

function buildUpaasRecommendation(productKeys: ProductKey[]) {
  const recs = productKeys.map((productKey) => ({ productKey }));
  return [{ productKey: ProductKey.JIRA_SOFTWARE }].concat(recs);
}

function upaasRecommendation(
  variation: string | boolean,
): RecommendationItem[] {
  if (variation === 'variation1') {
    return buildUpaasRecommendation([
      ProductKey.CONFLUENCE,
      ProductKey.JIRA_SERVICE_DESK,
      ProductKey.OPSGENIE,
    ]);
  } else if (variation === 'variation2') {
    return buildUpaasRecommendation([
      ProductKey.CONFLUENCE,
      ProductKey.OPSGENIE,
      ProductKey.JIRA_SERVICE_DESK,
    ]);
  } else if (variation === 'variation3') {
    return buildUpaasRecommendation([
      ProductKey.JIRA_SERVICE_DESK,
      ProductKey.OPSGENIE,
      ProductKey.CONFLUENCE,
    ]);
  } else if (variation === 'variation4') {
    return buildUpaasRecommendation([
      ProductKey.JIRA_SERVICE_DESK,
      ProductKey.CONFLUENCE,
      ProductKey.OPSGENIE,
    ]);
  } else if (variation === 'variation5') {
    return buildUpaasRecommendation([
      ProductKey.OPSGENIE,
      ProductKey.CONFLUENCE,
      ProductKey.JIRA_SERVICE_DESK,
    ]);
  } else if (variation === 'variation6') {
    return buildUpaasRecommendation([
      ProductKey.OPSGENIE,
      ProductKey.JIRA_SERVICE_DESK,
      ProductKey.CONFLUENCE,
    ]);
  }

  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function productStoreRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function productStoreInTrelloRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function productStoreInTrelloJSWFirstRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export function productStoreInTrelloConfluenceFirstRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export const upaasExperiment = {
  flagKey: UPAAS_EXPERIMENT_FEATURE_FLAG_KEY,
  variationValues: UPAAS_EXPERIMENT_VARIATIONS,
  recommendations: upaasRecommendation,
  showFeatureFlagVariation: showFeatureFlagVariationForUPaas,
};
