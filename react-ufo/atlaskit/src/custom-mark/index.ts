import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';

export default function UFOCustomMark({ name, timestamp }: { name: string; timestamp?: number }) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (interactionContext != null) {
			interactionContext.addMark(name, timestamp);
		}
	}, [interactionContext, name, timestamp]);
	return null;
}
