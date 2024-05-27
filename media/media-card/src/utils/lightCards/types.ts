import { type CardDimensions } from '../../types';
import { type MediaFeatureFlags } from '@atlaskit/media-common';

export interface StaticCardProps {
  dimensions?: CardDimensions;
  testId?: string;
  featureFlags?: MediaFeatureFlags;
}

export interface WrapperProps {
  dimensions: CardDimensions;
  testId?: string;
  children?: JSX.Element;
}
