import { type JsonLd } from 'json-ld-types';

import { type ViewRelatedLinksActionData } from '../../../state/flexible-ui-context/types';
import { extractLink } from '@atlaskit/link-extractors';

export const extractViewRelatedLinksAction = (
	response: JsonLd.Response,
): ViewRelatedLinksActionData | undefined => {
	if (!response?.meta?.supportedFeature?.includes('RelatedLinks')) {
		return;
	}
	const url = extractLink(response.data as JsonLd.Data.BaseData);

	if (!url) {
		return;
	}

	return {
		url,
	};
};
