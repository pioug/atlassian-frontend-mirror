import type React from 'react';

export const handleClickCommon = (
	event: React.MouseEvent,
	onClick?: React.MouseEventHandler,
): void => {
	if (onClick) {
		event.preventDefault();
		event.stopPropagation();
		onClick(event);
	}
};
