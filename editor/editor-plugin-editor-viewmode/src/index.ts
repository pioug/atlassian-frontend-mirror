/* eslint-disable @atlaskit/editor/no-re-export, @atlaskit/editor/only-export-plugin */
// Entry file in package.json

export { editorViewModePlugin, editorViewModeWithGracefulEditPlugin } from './editorViewmodePlugin';
export type {
	EditorViewModePluginConfig,
	EditorViewModePluginOptions,
	EditorViewModePluginState,
	EditorViewModePlugin,
	ViewMode,
	ContentMode,
} from './editorViewmodePluginType';
