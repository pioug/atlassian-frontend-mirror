import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export interface PlaceholderPluginOptions {
	emptyLinePlaceholder?: string;
	placeholder?: string;
	placeholderBracketHint?: string;
	placeholderPrompts?: string[];
}

export type PlaceholderPlugin = NextEditorPlugin<
	'placeholder',
	{
		commands: {
			setAnimatingPlaceholderPrompts: (placeholderPrompts: string[]) => EditorCommand;
			setPlaceholder: (placeholder: string) => EditorCommand;
			setPlaceholderHidden: (isPlaceholderHidden: boolean) => EditorCommand;
		};
		dependencies: [FocusPlugin, CompositionPlugin, TypeAheadPlugin, OptionalPlugin<ShowDiffPlugin>];
		pluginConfiguration: PlaceholderPluginOptions | undefined;
	}
>;
