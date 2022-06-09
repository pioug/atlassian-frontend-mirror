import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';
import { CardInnerAppearance } from '../../view/Card/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  handleAnalytics: AnalyticsHandler;
  extensionKey?: string;
  source?: CardInnerAppearance;
  testId?: string;
}
