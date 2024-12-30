import { type JsonLd } from 'json-ld-types';

import { type AnalyticsOrigin } from '../../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../../view/Card/types';

export type ExtractActionsProps = {
	response: JsonLd.Response;
	actionOptions?: CardActionOptions;
	extensionKey?: string;
	source?: CardInnerAppearance;
	origin?: AnalyticsOrigin;
};
