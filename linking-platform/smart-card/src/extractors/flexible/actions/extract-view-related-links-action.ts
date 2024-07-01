import { type JsonLd } from 'json-ld-types';

import { type ViewRelatedLinksActionData } from '../../../state/flexible-ui-context/types';
import { extractAri } from '@atlaskit/link-extractors';

export const extractViewRelatedLinksAction = (
	response: JsonLd.Response,
): ViewRelatedLinksActionData | undefined => {
	if (!response?.meta?.supportedFeature?.includes('RelatedLinks')) {
		return;
	}
	const ari = extractAri(response.data as JsonLd.Data.BaseData);

	if (!ari) {
		return;
	}

	return {
		ari,
	};
};
