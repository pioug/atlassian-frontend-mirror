import { type KeyboardEvent } from 'react';

export const handleNavKeyDown = (
	event: KeyboardEvent<HTMLElement>,
	itemsLength: number,
	activeIndex: number,
) => {
	let updatedIndex = activeIndex;
	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			updatedIndex = (activeIndex + 1) % itemsLength;
			break;

		case 'ArrowUp':
			event.preventDefault();
			updatedIndex = activeIndex > 0 ? activeIndex - 1 : itemsLength - 1;
			break;

		case 'Home':
			event.preventDefault();
			updatedIndex = 0;
			break;

		case 'End':
			event.preventDefault();
			updatedIndex = itemsLength - 1;
			break;
	}
	return updatedIndex;
};
