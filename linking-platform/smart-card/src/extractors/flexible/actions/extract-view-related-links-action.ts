import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkAri } from '@atlaskit/link-extractors';

import { type ViewRelatedLinksActionData } from '../../../state/flexible-ui-context/types';

export const extractViewRelatedLinksAction = (
	response: JsonLd.Response,
): ViewRelatedLinksActionData | undefined => {
	if (!response?.meta?.supportedFeature?.includes('RelatedLinks')) {
		return;
	}

	const ari = extractSmartLinkAri(response);

	if (!ari) {
		return;
	}

	return {
		ari,
	};
};
