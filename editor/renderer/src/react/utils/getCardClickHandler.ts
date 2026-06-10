import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import type { CardProps } from '@atlaskit/smart-card';

import { getEventHandler } from '../../utils';

export const getCardClickHandler = (
	eventHandlers?: EventHandlers,
	url?: string,
): CardProps['onClick'] | undefined => {
	const handler = getEventHandler(eventHandlers, 'smartCard');

	if (fg('platform_smartlink_xpc_url_wrapping')) {
		return handler ? (e, data) => handler(e, data?.destinationUrl ?? data?.url ?? url) : undefined;
	}

	return handler ? (e: React.MouseEvent<HTMLElement>) => handler(e, url) : undefined;
};
