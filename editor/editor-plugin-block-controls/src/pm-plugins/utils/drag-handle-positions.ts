import { fg } from '@atlaskit/platform-feature-flags';

import {
	DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT,
	DRAG_HANDLE_H1_TOP_ADJUSTMENT,
	DRAG_HANDLE_H2_TOP_ADJUSTMENT,
	DRAG_HANDLE_H4_TOP_ADJUSTMENT,
	DRAG_HANDLE_H5_TOP_ADJUSTMENT,
	DRAG_HANDLE_H6_TOP_ADJUSTMENT,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_WIDTH,
	dragHandleGap,
} from '../../ui/consts';

export const getTopPosition = (dom: HTMLElement | null, type?: string) => {
	if (!dom) {
		return 'auto';
	}
	const table = dom.querySelector('table');

	const isTable = fg('platform_editor_advanced_layouts_post_fix_patch_1')
		? table && (!type || type === 'table')
		: table;

	if (isTable) {
		return `${dom.offsetTop + (table?.offsetTop || 0)}px`;
	} else if (type === 'rule') {
		return `${dom.offsetTop - DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT}px`;
	} else if (type === 'layoutColumn') {
		if (fg('platform_editor_advanced_layouts_post_fix_patch_1')) {
			return `${-dom.offsetTop / 2}px`;
		} else {
			return `${-DRAG_HANDLE_WIDTH}px`;
		}
	} else if (type === 'heading-1') {
		return `${dom.offsetTop + DRAG_HANDLE_H1_TOP_ADJUSTMENT}px`;
	} else if (type === 'heading-2') {
		return `${dom.offsetTop + DRAG_HANDLE_H2_TOP_ADJUSTMENT}px`;
	} else if (type === 'heading-3') {
		return `${dom.offsetTop}px`;
	} else if (type === 'heading-4') {
		return `${dom.offsetTop - DRAG_HANDLE_H4_TOP_ADJUSTMENT}px`;
	} else if (type === 'heading-5') {
		return `${dom.offsetTop - DRAG_HANDLE_H5_TOP_ADJUSTMENT}px`;
	} else if (type === 'heading-6') {
		return `${dom.offsetTop - DRAG_HANDLE_H6_TOP_ADJUSTMENT}px`;
	} else {
		return `${dom.offsetTop}px`;
	}
};

export const getLeftPosition = (
	dom: HTMLElement | null,
	type: string,
	innerContainer?: HTMLElement | null,
	macroInteractionUpdates?: boolean,
	parentType?: string,
) => {
	if (!dom) {
		return 'auto';
	}
	if (!innerContainer) {
		return type === 'layoutColumn'
			? `${dom.offsetLeft + dom.clientWidth / 2 - DRAG_HANDLE_HEIGHT / 2}px`
			: `${dom.offsetLeft - dragHandleGap(type, parentType) - DRAG_HANDLE_WIDTH}px`;
	}

	// There is a showMacroInteractionDesignUpdates prop in extension node wrapper that can add a relative span under the top level div
	// We need to adjust the left offset position of the drag handle to account for the relative span
	const relativeSpan: HTMLElement | null = macroInteractionUpdates
		? dom.querySelector('span.relative')
		: null;
	const leftAdjustment = relativeSpan ? relativeSpan.offsetLeft : 0;

	return getComputedStyle(innerContainer).transform === 'none'
		? `${innerContainer.offsetLeft + leftAdjustment - dragHandleGap(type, parentType) - DRAG_HANDLE_WIDTH}px`
		: `${innerContainer.offsetLeft + leftAdjustment - innerContainer.offsetWidth / 2 - dragHandleGap(type, parentType) - DRAG_HANDLE_WIDTH}px`;
};
