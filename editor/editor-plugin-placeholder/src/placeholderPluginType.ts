import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export interface PlaceholderPluginOptions {
	placeholder?: string;
	placeholderBracketHint?: string;
}

export type PlaceholderPlugin = NextEditorPlugin<
	'placeholder',
	{
		pluginConfiguration: PlaceholderPluginOptions | undefined;
		dependencies: [FocusPlugin, CompositionPlugin, TypeAheadPlugin];
	}
>;
