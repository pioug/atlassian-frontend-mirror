import { type ComponentType } from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';

export { type AlignmentValue } from './types';
export { DEFAULT_ALIGNMENT, ALIGNMENT_VALUES } from './constants';

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

/**
 * Built-in toolbar action keys that can be referenced in the order array.
 */
export const BUILTIN_TOOLBAR_KEYS = {
	REFRESH: 'refresh',
	EMBED: 'embed',
	BORDER: 'border',
	ALIGNMENT: 'alignment',
	OPEN_IN_NEW_WINDOW: 'openInNewWindow',
	MORE_OPTIONS: 'moreOptions',
	SEPARATOR: 'separator',
} as const;

export type BuiltinToolbarKey = (typeof BUILTIN_TOOLBAR_KEYS)[keyof typeof BUILTIN_TOOLBAR_KEYS];

/**
 * Configuration for editor toolbar actions in the manifest.
 *
 * Use `customActions` map + `order` array to mix custom and built-in actions.
 *
 * @typeParam TCustomActions - The type of the customActions record. Keys are automatically
 * inferred and used to type-check the `order` array.
 */
export type ManifestEditorToolbarActions<
	TCustomActions extends Record<string, EditorToolbarAction> = Record<string, EditorToolbarAction>,
> = {
	/**
	 * Custom action definitions, keyed by unique identifier.
	 * These can be referenced in the `order` array alongside built-in keys.
	 */
	customActions?: TCustomActions;

	/**
	 * Ordered array of keys specifying which toolbar items to show and in what order.
	 * Can include:
	 * - Built-in keys: 'refresh', 'embed', 'border', 'alignment', 'openInNewWindow', 'moreOptions'
	 * - 'separator' for visual separators between groups
	 * - Custom keys defined in `customActions`
	 */
	order?: (BuiltinToolbarKey | keyof TCustomActions)[];
};

/**
 * Helper function to create a type-safe ManifestEditorToolbarActions config.
 * Automatically infers custom action keys from the customActions object.
 *
 * @example
 * ```ts
 * const config = createEditorToolbarActions({
 *   customActions: {
 *     myAction: { type: 'button', key: 'myAction', ... },
 *   },
 *   order: ['refresh', 'myAction', 'separator'], // 'myAction' is type-checked
 * });
 * ```
 */
export const createEditorToolbarActions = <
	const TCustomActions extends Record<string, EditorToolbarAction>,
>(config: {
	customActions: TCustomActions;
	order: (BuiltinToolbarKey | keyof TCustomActions)[];
}): ManifestEditorToolbarActions<TCustomActions> => config;
