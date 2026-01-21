import type React from 'react';

type Event = React.MouseEvent | React.KeyboardEvent;

export const isBasicClick = (event: Event): boolean => {
	return !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};
