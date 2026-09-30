import { type MouseEventHandler } from 'react';

import type { TriggerAriaProps } from '@atlaskit/popup/types';

type TAvatarHasPopup = TriggerAriaProps['aria-haspopup'];

const getCustomElement: (
	isDisabled?: boolean,
	href?: string,
	onClick?: MouseEventHandler,
	ariaHasPopup?: TAvatarHasPopup,
) => 'a' | 'button' | 'span' = (
	isDisabled?: boolean,
	href?: string,
	onClick?: MouseEventHandler,
	ariaHasPopup?: TAvatarHasPopup,
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
