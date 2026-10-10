import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type { AlignmentPluginState } from './pm-plugins/types';

export type AlignmentPluginDependencies = [
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<UserPreferencesPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<InteractionPlugin>,
];

export type AlignmentPlugin = NextEditorPlugin<
	'alignment',
	{
		dependencies: AlignmentPluginDependencies;
		sharedState: AlignmentPluginState | undefined;
	}
>;

export type InputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB | INPUT_METHOD.SHORTCUT;
