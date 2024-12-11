import { type JsonLd } from 'json-ld-types';

import { type AnalyticsFacade } from '../../../state/analytics';
import { type AnalyticsOrigin } from '../../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../../view/Card/types';

export type ExtractActionsProps = {
	response: JsonLd.Response;
	analytics: AnalyticsFacade;
	actionOptions?: CardActionOptions;
	extensionKey?: string;
	source?: CardInnerAppearance;
	origin?: AnalyticsOrigin;
};
