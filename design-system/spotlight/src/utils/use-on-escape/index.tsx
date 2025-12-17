import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';

const onKeyDown = (event: KeyboardEvent, { onEscape }: { onEscape: () => void }) => {
	switch (event.key) {
		case 'Escape':
			onEscape();
			break;

		default:
			break;
	}
};

export const useOnEscape = (onEscape: (event: KeyboardEvent) => void): void => {
	useEffect(() => {
		const doc = getDocument();
		if (!doc) {
			return;
		}

		const unbindFocusIn = bind(doc, {
			type: 'keydown',
			listener: (event) =>
				onKeyDown(event, {
					onEscape: () => onEscape(event),
				}),
		});

		return () => {
			unbindFocusIn();
		};
	}, [onEscape]);
};
