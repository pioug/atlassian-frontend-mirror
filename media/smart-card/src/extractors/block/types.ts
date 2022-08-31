import { LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';
import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsFacade } from '../../state/analytics';
import { CardInnerAppearance } from '../../view/Card/types';
import { AnalyticsOrigin } from '../../utils/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  analytics: AnalyticsFacade;
  origin?: AnalyticsOrigin;
  extensionKey?: string;
  featureFlags?: Partial<LinkingPlatformFeatureFlags>;
  source?: CardInnerAppearance;
  testId?: string;
}
