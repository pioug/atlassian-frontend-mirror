import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { CardProps } from '@atlaskit/smart-card';

import { getEventHandler } from '../../utils';

export const getCardClickHandler = (
	eventHandlers?: EventHandlers,
	url?: string,
): CardProps['onClick'] | undefined => {
	const handler = getEventHandler(eventHandlers, 'smartCard');

	return handler ? (e, data) => handler(e, data?.destinationUrl ?? data?.url ?? url) : undefined;
};
