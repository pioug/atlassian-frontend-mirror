import { type MouseEventHandler } from 'react';

export const getCustomElement = (
	isDisabled?: boolean,
	href?: string,
	onClick?: MouseEventHandler,
) => {
	if (href && !isDisabled) {
		return 'a';
	}
	if (onClick || isDisabled) {
		return 'button';
	}
	return 'span';
};
