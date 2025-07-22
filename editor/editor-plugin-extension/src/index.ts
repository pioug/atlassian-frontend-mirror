/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export type {
	CreateExtensionAPI,
	ExtensionPlugin,
	ExtensionPluginOptions,
	InsertOrReplaceExtensionType,
	RunMacroAutoConvert,
	RejectSave,
	ExtensionPluginDependencies,
	ExtensionState,
	ExtensionAction,
	ExtensionPluginActions,
} from './extensionPluginType';
export { extensionPlugin } from './extensionPlugin';
