import type { EventHandlers } from '@atlaskit/editor-common/EventHandlers';
import type { CardProps } from '@atlaskit/smart-card/card/types';

import { getEventHandler } from '../../utils';

export const getCardClickHandler = (
	eventHandlers?: EventHandlers,
	url?: string,
): CardProps['onClick'] | undefined => {
	const handler = getEventHandler(eventHandlers, 'smartCard');

	return handler ? (e, data) => handler(e, data?.destinationUrl ?? data?.url ?? url) : undefined;
};
