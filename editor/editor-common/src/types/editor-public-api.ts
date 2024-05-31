import type { EditorPresetBuilder } from '../preset/builder';

import type { ExtractNextEditorPlugins, PublicPluginAPI } from './next-editor-plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractPublicEditorAPI<T extends EditorPresetBuilder<any, any>> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends EditorPresetBuilder<any, infer Plugins>
		? PublicPluginAPI<ExtractNextEditorPlugins<Plugins>>
		: PublicPluginAPI<[]>;
