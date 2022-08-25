import { LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';
import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';
import { CardInnerAppearance } from '../../view/Card/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  handleAnalytics: AnalyticsHandler;
  extensionKey?: string;
  featureFlags?: Partial<LinkingPlatformFeatureFlags>;
  source?: CardInnerAppearance;
  testId?: string;
}
