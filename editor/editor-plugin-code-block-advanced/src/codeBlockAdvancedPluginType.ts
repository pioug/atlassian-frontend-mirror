import type { Extension } from '@codemirror/state';

import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';

export type CodeBlockAdvancedPlugin = NextEditorPlugin<
	'codeBlockAdvanced',
	{
		dependencies: [CodeBlockPlugin, SelectionPlugin, OptionalPlugin<EditorDisabledPlugin>];
		pluginConfiguration:
			| {
					extensions?: Extension[];
			  }
			| undefined;
	}
>;
