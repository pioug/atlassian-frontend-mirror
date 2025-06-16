import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import { type AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { AlignmentPluginState } from './pm-plugins/types';

export type AlignmentPluginDependencies = [
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<UserPreferencesPlugin>,
];

export type AlignmentPlugin = NextEditorPlugin<
	'alignment',
	{
		sharedState: AlignmentPluginState | undefined;
		dependencies: AlignmentPluginDependencies;
	}
>;

export type InputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB | INPUT_METHOD.SHORTCUT;
