import type { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockCollapsePlugin } from '@atlaskit/editor-plugin-block-collapse/blockCollapsePluginType';
import type { CardPlugin } from '@atlaskit/editor-plugin-card/cardPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand/types';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions/mentions-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block/synced-block-plugin-type';

import type { FindReplacePluginState, FindReplaceToolbarButtonActionProps } from './types';

export type FindReplacePluginOptions = {
	takeFullWidth: boolean;
	twoLineEditorToolbar: boolean;
};

export type FindReplacePluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<MentionsPlugin>,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<ExpandPlugin>,
	OptionalPlugin<BlockCollapsePlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<SyncedBlockPlugin>,
];

export type FindReplacePlugin = NextEditorPlugin<
	'findReplace',
	{
		actions: {
			activateFindReplace: (
				triggerMethod?: TRIGGER_METHOD.SHORTCUT | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.EXTERNAL,
			) => boolean;
			registerToolbarButton: (params: FindReplaceToolbarButtonActionProps) => React.ReactNode;
		};
		dependencies: FindReplacePluginDependencies;
		pluginConfiguration: FindReplacePluginOptions;
		sharedState: FindReplacePluginState | undefined;
	}
>;
