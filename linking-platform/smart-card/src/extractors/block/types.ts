import { type InvokeHandler } from '../../model/invoke-handler';
import { type AnalyticsFacade } from '../../state/analytics';
import { type CardActionOptions, type CardInnerAppearance } from '../../view/Card/types';
import { type AnalyticsOrigin } from '../../utils/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  analytics: AnalyticsFacade;
  origin?: AnalyticsOrigin;
  extensionKey?: string;
  source?: CardInnerAppearance;
  testId?: string;
  actionOptions?: CardActionOptions;
}
