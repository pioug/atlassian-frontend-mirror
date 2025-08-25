import { type JsonLd } from '@atlaskit/json-ld-types';

import { type AnalyticsOrigin } from '../../../utils/types';
import { type CardActionOptions, type CardInnerAppearance } from '../../../view/Card/types';

export type ExtractActionsProps = {
	actionOptions?: CardActionOptions;
	extensionKey?: string;
	origin?: AnalyticsOrigin;
	response: JsonLd.Response;
	source?: CardInnerAppearance;
};
