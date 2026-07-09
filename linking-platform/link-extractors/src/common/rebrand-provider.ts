import { fg } from '@atlaskit/platform-feature-flags';

import type { LinkProvider } from '../index';

const GOOGLE_DRIVE = 'Google Drive';

export const rebrandProvider = (provider?: LinkProvider): LinkProvider | undefined => {
	switch (provider?.text) {
		case 'Google':
			return {
				...provider,
				...(fg('platform_lp_use_entity_icon_url_for_icon')
					? { iconLabel: GOOGLE_DRIVE }
					: undefined),
				text: GOOGLE_DRIVE,
			};
		default:
			return provider;
	}
};
