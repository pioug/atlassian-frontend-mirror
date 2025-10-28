// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { selectionExtensionPlugin } from './selectionExtensionPlugin';
export type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
export type {
	BlockMenuExtensionConfiguration,
	ExtensionConfiguration,
	ExtensionMenuItemConfiguration,
	ExtensionToolbarItemConfiguration,
	InsertAdfAtEndOfDocResult,
	LinkInsertionOption,
	ReplaceWithAdfResult,
	SelectionExtension,
	SelectionExtensionComponentProps,
	SelectionExtensionPluginOptions,
	SelectionExtensionPluginState,
	SelectionExtensionSelectionInfo,
	ToolbarExtensionConfiguration,
	SelectionAdfResult,
	SelectionExtensionCallbackOptions,
} from './types';
