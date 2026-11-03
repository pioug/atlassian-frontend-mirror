import { useCallback, useContext } from 'react';

import InteractionContext from '@atlaskit/interaction-context';

import {
	type EventOrTimestamp,
	resolveInteractionTimestamp,
} from '../common/interaction-timestamp';

export default function usePressTracing(
	name: string,
): (eventOrTimestamp?: EventOrTimestamp) => void {
	const context = useContext(InteractionContext);

	const handleClick = useCallback(
		(eventOrTimestamp?: EventOrTimestamp) => {
			if (context) {
				const timestamp = resolveInteractionTimestamp(eventOrTimestamp) ?? performance.now();
				context.tracePress(name, timestamp);
			}
		},
		[context, name],
	);

	return handleClick;
}
