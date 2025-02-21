import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';

import type { HighlightPluginState } from './pm-plugins/main';

export type HighlightPluginOptions = {
	textHighlightingFloatingToolbarExperiment?: boolean;
};

export type HighlightPlugin = NextEditorPlugin<
	'highlight',
	{
		pluginConfiguration?: HighlightPluginOptions;
		dependencies: [
			// Optional, we won't log analytics if it's not available
			OptionalPlugin<AnalyticsPlugin>,
			// Optional, used to allow clearing highlights when clear
			OptionalPlugin<TextFormattingPlugin>,
			// Optional, you can not have a primary toolbar
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
		];
		sharedState: HighlightPluginState | undefined;
		commands: {
			changeColor: ({ color }: { color: string; inputMethod: INPUT_METHOD }) => EditorCommand;
		};
	}
>;
