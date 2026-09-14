import type React from 'react';

import { useLinkClicked } from './useLinkClicked';

const isNotLeftClick = (event: React.MouseEvent) => event.button !== 0;

export const useMouseDownEvent = <T extends React.MouseEventHandler>(
	onMouseDown?: T,
): ((...args: Parameters<T>) => void) => {
	return useLinkClicked(onMouseDown, isNotLeftClick);
};
