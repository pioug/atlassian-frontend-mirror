import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting/text-formatting-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type { HighlightPluginState } from './pm-plugins/main';

export type HighlightPlugin = NextEditorPlugin<
	'highlight',
	{
		commands: {
			changeColor: ({ color }: { color: string; inputMethod: INPUT_METHOD }) => EditorCommand;
		};
		dependencies: [
			// Optional, we won't log analytics if it's not available
			OptionalPlugin<AnalyticsPlugin>,
			// Optional, used to allow clearing highlights when clear
			OptionalPlugin<TextFormattingPlugin>,
			// Optional, you can not have a primary toolbar
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
		];
		sharedState: HighlightPluginState | undefined;
	}
>;
