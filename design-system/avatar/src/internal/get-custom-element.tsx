import { type MouseEventHandler } from 'react';

const getCustomElement: (
	isDisabled?: boolean,
	href?: string,
	onClick?: MouseEventHandler,
	ariaHasPopup?: boolean | 'dialog',
) => 'a' | 'button' | 'span' = (
	isDisabled?: boolean,
	href?: string,
	onClick?: MouseEventHandler,
	ariaHasPopup?: boolean | 'dialog',
) => {
	if (href && !isDisabled) {
		return 'a';
	}
	if (onClick || isDisabled || ariaHasPopup) {
		return 'button';
	}
	return 'span';
};

export default getCustomElement;
