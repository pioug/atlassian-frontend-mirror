import type { Extension } from '@codemirror/state';

import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FindReplacePlugin } from '@atlaskit/editor-plugin-find-replace';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';

export type CodeBlockAdvancedPlugin = NextEditorPlugin<
	'codeBlockAdvanced',
	{
		dependencies: [
			OptionalPlugin<CodeBlockPlugin>,
			SelectionPlugin,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<SelectionMarkerPlugin>,
			OptionalPlugin<FindReplacePlugin>,
		];
		pluginConfiguration: CodeBlockAdvancedPluginOptions | undefined;
	}
>;

export type CodeBlockAdvancedPluginOptions = {
	allowCodeFolding?: boolean;
	extensions?: Extension[];
};
