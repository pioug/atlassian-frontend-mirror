import type { Breakpoint } from '@atlaskit/editor-toolbar';

import type { ToolbarInsertBlockButtonsConfig } from '../../../types';
import type { BlockMenuItem } from '../../ToolbarInsertBlock/create-items';

const ITEM_TO_BUTTON_MAP: Record<string, keyof ToolbarInsertBlockButtonsConfig> = {
	action: 'taskList',
	media: 'media',
	'image upload': 'media',
	mention: 'mention',
	emoji: 'emoji',
	table: 'table',
	layout: 'layout',
	codeblock: 'codeBlock',
};

const BREAKPOINT_ORDER: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];

/**
 * Determines if a toolbar button is visible at the current breakpoint.
 */
function isButtonVisibleAtBreakpoint(
	buttonShowAt: Breakpoint,
	currentBreakpoint: Breakpoint | null,
): boolean {
	if (!currentBreakpoint) {
		return false;
	}

	const showAtIndex = BREAKPOINT_ORDER.indexOf(buttonShowAt);
	const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);

	return currentIndex >= showAtIndex;
}

export function filterDropdownItemsByBreakpoint(
	items: BlockMenuItem[],
	currentBreakpoint: Breakpoint | null,
	toolbarConfig: ToolbarInsertBlockButtonsConfig,
): BlockMenuItem[] {
	return items.filter((item) => {
		const itemName = item.value.name;
		const buttonKey = ITEM_TO_BUTTON_MAP[itemName];

		if (!buttonKey) {
			return true;
		}

		const buttonConfig = toolbarConfig[buttonKey];

		if (!buttonConfig?.enabled) {
			return true;
		}

		const showAt = buttonConfig.showAt || 'lg';
		const isVisible = isButtonVisibleAtBreakpoint(showAt, currentBreakpoint);

		return !isVisible;
	});
}
