/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

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

/**
 * @deprecated Use `import { UFOCustomMarks } from '@atlaskit/react-ufo/ufo-custom-marks'` instead.
 */
export { UFOCustomMarks } from './UFOCustomMarks';
/**
 * @deprecated Use `import { addUFOCustomMark } from '@atlaskit/react-ufo/add-ufo-custom-mark'` instead.
 */
export { addUFOCustomMark } from './addUFOCustomMark';
