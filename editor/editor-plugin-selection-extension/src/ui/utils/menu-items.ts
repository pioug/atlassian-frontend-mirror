import type {
	ExtensionMenuItemConfiguration,
	ExtensionNestedDropdownMenuConfiguration,
} from '../../types';

/**
 * Type guard to check if the given configuration is for a dropdown menu.
 *
 * @param item - The menu item configuration to check, either menu item or dropdown menu
 * @returns True if the item configuration is for a dropdown menu, false otherwise
 */
export const isNestedDropdownMenuConfiguration = (
	item: ExtensionMenuItemConfiguration,
): item is ExtensionNestedDropdownMenuConfiguration => {
	return 'getMenuItems' in item && typeof item.getMenuItems === 'function';
};
