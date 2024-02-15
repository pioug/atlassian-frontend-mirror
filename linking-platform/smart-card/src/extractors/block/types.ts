import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsFacade } from '../../state/analytics';
import { CardActionOptions, CardInnerAppearance } from '../../view/Card/types';
import { AnalyticsOrigin } from '../../utils/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  analytics: AnalyticsFacade;
  origin?: AnalyticsOrigin;
  extensionKey?: string;
  source?: CardInnerAppearance;
  testId?: string;
  actionOptions?: CardActionOptions;
}
