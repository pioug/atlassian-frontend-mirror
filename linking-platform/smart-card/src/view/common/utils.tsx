import type React from 'react';

import facepaint from 'facepaint';

// this function is used for spacing, fontsize and line height,
// once design tokens have been established for the all of these categories
// then this function can be replaced with the tokens
/**
 * @deprecated, these can be replaced with constants
 */
const gs = (times: number) => `${8 * times}px`;
/**
 * @deprecated, these can be replaced with constants
 */
const br = (times = 1) => `${3 * times}px`;
/**
 * @deprecated, these can be replaced with constants
 */
const mq = facepaint(['@media(min-width: 576px)']);

export { gs, br, mq };

export const handleClickCommon = (event: React.MouseEvent, onClick?: React.MouseEventHandler) => {
	if (onClick) {
		event.preventDefault();
		event.stopPropagation();
		onClick(event);
	}
};
