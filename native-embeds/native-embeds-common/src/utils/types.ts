import type { ComponentType } from 'react';

import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { NewCoreIconProps } from '@atlaskit/icon';

import type { BUILTIN_TOOLBAR_KEYS, EDITOR_TOOLBAR_HANDLER_KEYS } from './constants';

export type AlignmentValue = 'left' | 'center' | 'right' | 'wrap-left' | 'wrap-right';
export type NativeEmbedAppearance = 'url' | 'inline' | 'block' | 'embed';
export type NativeEmbedParameterValues = {
	alignment: AlignmentValue;
	alwaysShowTitle: boolean;
	displayText?: string;
	height: number;
	url?: string;
	width?: number;
};

export type NativeEmbedParameterValue = {
	value: string;
};

export type NativeEmbedParameters = {
	macroParams?: {
		alignment?: NativeEmbedParameterValue;
		alwaysShowTitle?: NativeEmbedParameterValue;
		displayText?: NativeEmbedParameterValue;
		height?: NativeEmbedParameterValue;
		url?: NativeEmbedParameterValue;
		width?: NativeEmbedParameterValue;
	};
};

export type NativeEmbedParameterKey = keyof NonNullable<NativeEmbedParameters['macroParams']>;

export type EditorToolbarHandlerContext = {
	editorApi?: PublicPluginAPI<[]>;
};

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

/**
 * Handlers for built-in native embed floating toolbar actions.
 * Can be defined in the manifest (editorToolbarHandlers) and are invoked
 * by the editor plugin when the corresponding toolbar buttons are clicked.
 * Handlers with context (e.g. onAlignmentClick, onAppearanceClick) receive
 * an optional second parameter for the action-specific value.
 */
export type EditorToolbarHandlerKey = (typeof EDITOR_TOOLBAR_HANDLER_KEYS)[number];

export type EditorToolbarHandlers = Partial<{
	onAlignmentClick: (
		parameters: NativeEmbedParameterValues,
		alignment: AlignmentValue,
		context?: EditorToolbarHandlerContext,
	) => void;
	onAppearanceClick: (
		parameters: NativeEmbedParameterValues,
		appearance: NativeEmbedAppearance,
		context?: EditorToolbarHandlerContext,
	) => void;
	onAskRovoClick: (
		parameters: NativeEmbedParameterValues,
		context?: EditorToolbarHandlerContext,
	) => void;
	onChangeBorderClick: EditorToolbarHandler;
	/**
	 * Handler invoked when the Copy action is clicked.
	 * Copies the native-embed node to the clipboard.
	 */
	onCopyClick: EditorToolbarHandler;
	/**
	 * @private
	 * @deprecated Use `onCopyClick` instead. This is a deprecated alias and will be removed in a future release.
	 */
	onCopyLinkClick: EditorToolbarHandler;
	onDeleteClick: EditorToolbarHandler;
	onEditClick: EditorToolbarHandler;
	onEditUrlClick: EditorToolbarHandler;
	onOpenInNewWindowClick: EditorToolbarHandler;
	onRefreshClick: EditorToolbarHandler;
	onSetEmbedTypeClick: EditorToolbarHandler;
	onShowTitleClick: EditorToolbarHandler;
}>;

/** Base handler signature for contexts that don't have action-specific context. */
export type EditorToolbarHandler = (
	parameters: NativeEmbedParameterValues,
	context?: EditorToolbarHandlerContext,
) => void;

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
	 * Handlers for built-in toolbar buttons.
	 * When a built-in button (e.g. ASK_ROVO, REFRESH) is clicked, the corresponding
	 * handler is invoked by the editor plugin.
	 */
	editorToolbarHandlers?: EditorToolbarHandlers;

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
