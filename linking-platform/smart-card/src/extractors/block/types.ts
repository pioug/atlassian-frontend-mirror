import { type InvokeHandler } from '../../model/invoke-handler';
import { type AnalyticsFacade } from '../../state/analytics';
import { type AnalyticsOrigin } from '../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../view/Card/types';

export interface ExtractBlockOpts {
	handleInvoke: InvokeHandler;
	analytics: AnalyticsFacade;
	origin?: AnalyticsOrigin;
	extensionKey?: string;
	source?: CardInnerAppearance;
	testId?: string;
	actionOptions?: CardActionOptions;
}
