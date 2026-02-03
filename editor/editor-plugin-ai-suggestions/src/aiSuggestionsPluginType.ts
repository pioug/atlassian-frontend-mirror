import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';

export type AiSuggestionsPlugin = NextEditorPlugin<
	'aiSuggestions',
	{
		dependencies: [
			/**
			 * Primary toolbar plugin for registering the suggestions button (legacy).
			 */
			OptionalPlugin<PrimaryToolbarPlugin>,
			/**
			 * Toolbar plugin for registering the suggestions button (AIFC).
			 */
			OptionalPlugin<ToolbarPlugin>,
		];
	}
>;
