import { fg } from '@atlaskit/platform-feature-flags/fg';

import getDocument from './getDocument';

export function isPathBasedEnabled(): boolean {
	const isLocalhost = getDocument()?.location?.hostname === 'localhost';
	return fg('platform_media_path_based_route') && !isLocalhost;
}
