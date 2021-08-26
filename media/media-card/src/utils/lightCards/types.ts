import { CardDimensions } from '../../utils/cardDimensions';
import { MediaFeatureFlags } from '@atlaskit/media-common';

export interface StaticCardProps {
  dimensions?: CardDimensions;
  testId?: string;
  featureFlags?: MediaFeatureFlags;
}
