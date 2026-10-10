import type { Extension } from '@codemirror/state';

import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block/codeBlockPluginType';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format/contentFormatPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { FindReplacePlugin } from '@atlaskit/editor-plugin-find-replace/findReplacePluginType';
import type { SelectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker/selection-marker-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';

export type CodeBlockAdvancedPlugin = NextEditorPlugin<
	'codeBlockAdvanced',
	{
		dependencies: [
			OptionalPlugin<CodeBlockPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			SelectionPlugin,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<SelectionMarkerPlugin>,
			OptionalPlugin<FindReplacePlugin>,
			OptionalPlugin<ContentFormatPlugin>,
		];
		pluginConfiguration: CodeBlockAdvancedPluginOptions | undefined;
	}
>;

export type CodeBlockAdvancedPluginOptions = {
	allowCodeFolding?: boolean;
	extensions?: Extension[];
};
