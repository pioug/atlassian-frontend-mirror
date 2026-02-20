import { type MouseEventHandler } from 'react';

import type { AppearanceType } from './types';

export const getCustomElement: (isDisabled?: boolean, href?: string, onClick?: MouseEventHandler, ariaHasPopup?: boolean | 'dialog') => "a" | "button" | "span" = (
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

export function getAppearanceForAppType(appType: string | null | undefined): AppearanceType {
	switch (appType) {
		case 'agent':
			return 'hexagon';
		case 'user':
		case 'system':
		default:
			return 'circle';
	}
}
