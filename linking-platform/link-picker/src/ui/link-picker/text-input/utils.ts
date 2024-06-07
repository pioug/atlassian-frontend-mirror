import { type KeyboardEvent } from 'react';

import { browser } from '@atlaskit/linking-common/user-agent';

const KeyZCode = 90;
const KeyYCode = 89;

export const isUndoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
	const { mac } = browser();

	return (
		e.keyCode === KeyZCode &&
		// cmd + z for mac
		((mac && e.metaKey && !e.shiftKey) ||
			// ctrl + z for non-mac
			(!mac && e.ctrlKey))
	);
};

export const isRedoEvent = (e: KeyboardEvent<HTMLInputElement>) => {
	const { mac } = browser();

	return (
		// ctrl + y for non-mac
		(!mac && e.ctrlKey && e.keyCode === KeyYCode) ||
		(mac && e.metaKey && e.shiftKey && e.keyCode === KeyZCode) ||
		(e.ctrlKey && e.shiftKey && e.keyCode === KeyZCode)
	);
};
