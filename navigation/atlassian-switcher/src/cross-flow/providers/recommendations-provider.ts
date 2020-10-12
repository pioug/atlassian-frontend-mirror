import asDataProvider from '../../common/providers/as-data-provider';
import {
  RecommendationsEngineResponse,
  RecommendationsFeatureFlags,
} from '../../types';

import { resolveRecommendations } from './recommendations';

const fetchRecommendations = ({
  featureFlags,
}: {
  featureFlags?: RecommendationsFeatureFlags;
}): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations(featureFlags));

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
