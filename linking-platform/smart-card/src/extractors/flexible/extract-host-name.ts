import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

export const extractHostName = (response?: SmartLinkResponse): string | undefined => {
	try {
		const url = extractSmartLinkUrl(response);
		const hostName = url ? new URL(url).hostname : undefined;
		return hostName;
	} catch {
		return undefined;
	}
};
