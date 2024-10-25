import { useCallback, useContext } from 'react';

import InteractionContext from '@atlaskit/interaction-context';

export default function usePressTracing(name: string) {
	const context = useContext(InteractionContext);

	const handleClick = useCallback(
		(timeStamp?: number) => {
			if (context) {
				const time = timeStamp || performance.now();
				context.tracePress(name, time);
			}
		},
		[context, name],
	);

	return handleClick;
}
