import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { CardProviderRenderers } from '@atlaskit/link-provider/types';

import { type IconType } from '../../../constants';
import extractIconRenderer from './extract-icon-renderer';
import extractJsonldDataIcon from './extract-jsonld-data-icon';

export const extractLinkIcon = (
	response: JsonLd.Response,
	renderers?: CardProviderRenderers,
): {
	icon?: IconType;
	label?: string;
	render: (() => React.ReactNode) | undefined;
	url?: string;
} => {
	const data = response.data as JsonLd.Data.BaseData;
	const render = extractIconRenderer(data, renderers);

	return { ...extractJsonldDataIcon(data), render };
};
