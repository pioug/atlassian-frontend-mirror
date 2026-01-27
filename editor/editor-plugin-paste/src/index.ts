/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export type {
	PastePlugin,
	PastePluginOptions,
	PastePluginState,
	LastContentPasted,
	PastePluginDependencies,
	ActiveFlag,
} from './pastePluginType';

export { pastePlugin } from './pastePlugin';
