import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractAri } from '@atlaskit/link-extractors';

import { type ViewRelatedLinksActionData } from '../../../state/flexible-ui-context/types';

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
