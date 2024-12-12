/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export type {
	CreateExtensionAPI,
	ExtensionPlugin,
	ExtensionPluginOptions,
	InsertOrReplaceExtensionType,
	RunMacroAutoConvert,
	RejectSave,
} from './types';
export { extensionPlugin } from './plugin';
