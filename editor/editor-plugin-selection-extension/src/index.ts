// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { selectionExtensionPlugin } from './selectionExtensionPlugin';
export type { SelectionExtensionPlugin } from './selectionExtensionPluginType';
export type {
	SelectionExtensionComponentProps,
	SelectionExtensionPluginOptions,
	SelectionExtension,
	LinkInsertionOption,
	SelectionExtensionPluginState,
	SelectionExtensionSelectionInfo,
	DynamicSelectionExtension,
	ReplaceWithAdfResult,
} from './types';
