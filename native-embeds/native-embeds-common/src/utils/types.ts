import type { ComponentType } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon';

import type { ALIGNMENT_VALUES, BUILTIN_TOOLBAR_KEYS } from './constants';

// Alignment types
export type AlignmentValue = (typeof ALIGNMENT_VALUES)[number];

// Editor toolbar action types
/**
 * A button action rendered in the editor floating toolbar.
 */
export type EditorToolbarButtonAction = {
	/**
	 * Whether this action is disabled.
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Handler key that maps to the actionHandlers config in the editor plugin.
	 * When clicked, the plugin looks up actionHandlers[handlerKey] and invokes it.
	 */
	handlerKey: string;

	/**
	 * Icon component to display.
	 */
	icon: ComponentType<NewCoreIconProps>;

	/**
	 * Unique key for this action, used for React keys and test IDs.
	 */
	key: string;

	/**
	 * Button label (used for tooltip and accessibility).
	 */
	label: string;

	/**
	 * Whether to show the label as text next to the icon.
	 * @default false
	 */
	showTitle?: boolean;

	type: 'button';
};

/**
 * Union type for editor toolbar actions.
 * Currently only supports buttons; dropdowns and separators can be added later.
 */
export type EditorToolbarAction = EditorToolbarButtonAction;

export type BuiltinToolbarKey = (typeof BUILTIN_TOOLBAR_KEYS)[keyof typeof BUILTIN_TOOLBAR_KEYS];

/**
 * Configuration for editor toolbar actions in the manifest.
 *
 * Use `customActions` map + `items` array to mix custom and built-in actions.
 *
 * @typeParam TCustomActions - The type of the customActions record. Keys are automatically
 * inferred and used to type-check the `items` array.
 */
export type ManifestEditorToolbarActions<
	TCustomActions extends Record<string, EditorToolbarAction> = Record<string, EditorToolbarAction>,
> = {
	/**
	 * Custom action definitions, keyed by unique identifier.
	 * These can be referenced in the `items` array alongside built-in keys.
	 */
	customActions?: TCustomActions;

	/**
	 * Ordered array of keys specifying which toolbar items to show and in what order.
	 * The "More Options" dropdown is appended automatically based on `moreItems`.
	 *
	 * Can include:
	 * - Built-in keys: 'refresh', 'embed', 'border', 'alignment', 'openInNewWindow'
	 * - 'separator' for visual separators between groups
	 * - Custom keys defined in `customActions`
	 */
	items?: (BuiltinToolbarKey | keyof TCustomActions)[];

	/**
	 * Ordered array of keys specifying which items appear in the "More Options" dropdown.
	 * When provided with at least one item, a separator and the dropdown are automatically
	 * appended to the toolbar. When omitted, the default set of dropdown items is used.
	 *
	 * Can include:
	 * - Built-in keys: 'alwaysShowTitle', 'setEmbedType', 'copyLink', 'delete'
	 * - 'separator' for visual separators between groups
	 * - Custom keys defined in `customActions` (shared with the toolbar)
	 */
	moreItems?: (BuiltinToolbarKey | keyof TCustomActions)[];
};
