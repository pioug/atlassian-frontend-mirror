import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractAri, extractSmartLinkAri } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { type ViewRelatedLinksActionData } from '../../../state/flexible-ui-context/types';

export const extractViewRelatedLinksAction = (
	response: JsonLd.Response,
): ViewRelatedLinksActionData | undefined => {
	if (!response?.meta?.supportedFeature?.includes('RelatedLinks')) {
		return;
	}

	const ari = fg('smart_links_noun_support')
		? extractSmartLinkAri(response)
		: extractAri(response.data as JsonLd.Data.BaseData);

	if (!ari) {
		return;
	}

	return {
		ari,
	};
};
