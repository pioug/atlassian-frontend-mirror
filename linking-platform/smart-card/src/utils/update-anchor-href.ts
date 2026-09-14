import { type KeyboardEvent, type MouseEvent } from 'react';

export const updateAnchorHref = (event: MouseEvent | KeyboardEvent, href: string): void => {
	if (!(event.currentTarget instanceof HTMLAnchorElement)) {
		return;
	}

	event.currentTarget.href = href;
};
