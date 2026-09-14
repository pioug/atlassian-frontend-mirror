import type { DocNode } from '@atlaskit/adf-schema/doc';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

import type { PlaceholderPromptAnimationOptions } from './pm-plugins/types';

export interface PlaceholderPluginOptions {
	emptyLinePlaceholder?: string;
	enableLoadingSpinner?: boolean;
	isPlaceholderHidden?: boolean;
	isRovoLLMEnabled?: boolean;
	placeholder?: string;
	placeholderADF?: DocNode;
	placeholderBracketHint?: string;
	placeholderPromptAnimationOptions?: PlaceholderPromptAnimationOptions;
	placeholderPrompts?: string[];
	withEmptyParagraph?: boolean;
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
