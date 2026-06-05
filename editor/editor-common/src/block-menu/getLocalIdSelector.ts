import { fg } from '@atlaskit/platform-feature-flags';

export const getLocalIdSelector = (localId: string, container: HTMLElement): HTMLElement | null => {
	// Check if the element with data-local-id exists
	let element = container.querySelector(`[data-local-id="${localId}"]`) as HTMLElement | null;

	if (element) {
		return element;
	}

	// Special case for decision lists and task lists which already have localId
	element = container.querySelector(`[data-decision-list-local-id="${localId}"]`);
	if (element) {
		return element;
	}

	element = container.querySelector(`[data-task-list-local-id="${localId}"]`);
	if (element) {
		return element;
	}

	// Special case for tables which use data-table-local-id
	element = container.querySelector(`[data-table-local-id="${localId}"]`);
	if (element) {
		if (fg('platform_editor_block_menu_v2_patch_4')) {
			return element.parentElement; // return table wrapper instead of table div, so the height calculation is correct
		}
		return element;
	}

	// Special case for extension, smart cards and media which use lowercase localid
	element = container.querySelector(`[localid="${localId}"]`);
	if (element) {
		return element;
	}

	return null;
};
