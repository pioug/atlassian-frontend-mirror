import type { JsonLd } from '@atlaskit/json-ld-types';

import type { CardActionOptions } from '../../view/Card/types';
import type { FlexibleCardProps } from '../../view/FlexibleCard/types';

export type ExtractClientActionsParam = {
	actionOptions?: CardActionOptions;
	appearance?: FlexibleCardProps['appearance'];
	id?: string;
	response: JsonLd.Response;
};
