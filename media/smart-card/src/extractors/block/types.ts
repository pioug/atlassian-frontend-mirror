import { InvokeHandler } from '../../model/invoke-handler';
import { AnalyticsHandler } from '../../utils/types';

export interface ExtractBlockOpts {
  handleInvoke: InvokeHandler;
  handleAnalytics: AnalyticsHandler;
  definitionId?: string;
  testId?: string;
}
