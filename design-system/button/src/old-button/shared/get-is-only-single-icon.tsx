import { type BaseProps } from '../types';

import { getIfVisuallyHiddenChildren } from './get-if-visually-hidden-children';

export default function getIsOnlySingleIcon({
	children,
	iconBefore,
	iconAfter,
}: Pick<BaseProps, 'children' | 'iconBefore' | 'iconAfter'>): boolean {
	if (getIfVisuallyHiddenChildren(children)) {
		return true;
	}
	if (children) {
		return false;
	}
	if (iconBefore && !iconAfter) {
		return true;
	}
	if (!iconBefore && iconAfter) {
		return true;
	}
	return false;
}
