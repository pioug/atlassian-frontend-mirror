import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function UFOCustomMarks({ data }: { data: { [key: string]: number } | undefined }): any {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (interactionContext != null && data != null) {
			Object.keys(data).forEach((i) => {
				interactionContext.addMark(i, data[i]);
			});
		}
	}, [data, interactionContext]);
	return null;
}
