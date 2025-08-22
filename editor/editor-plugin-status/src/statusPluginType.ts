import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { NextEditorPlugin, OptionalPlugin, Command } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type {
	commitStatusPicker,
	insertStatus,
	removeStatus,
	UpdateStatus,
} from './pm-plugins/actions';
import type { StatusPluginOptions, StatusState } from './types';

// This dummy type is to bypass the typescript compiler maximum length limit error
// TODO: ED-26962 - Fix the type definition of editor-core's createUniversalPreset
type DummyAnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		actions: {
			setInlineCommentDraftState: (isDraft: boolean, inputMethod: INPUT_METHOD) => Command;
		};
		sharedState: {
			annotations: Record<string, boolean>;
			bookmark: boolean;
			isVisible: boolean;
			mouseData: {
				isSelecting: boolean;
			};
		};
	}
>;

// This dummy type is to bypass the typescript compiler maximum length limit error
// TODO: ED-26962 - Fix the type definition of editor-core's createUniversalPreset
type DummyEditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: {
			mode: 'view' | 'edit';
		};
	}
>;

export type StatusPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<DummyAnnotationPlugin>,
	OptionalPlugin<DummyEditorViewModePlugin>,
];

export type StatusPluginActions = {
	commitStatusPicker: typeof commitStatusPicker;
	updateStatus: UpdateStatus;
};

export type StatusPluginCommands = {
	insertStatus: ReturnType<typeof insertStatus>;
	removeStatus: typeof removeStatus;
};

export type StatusPlugin = NextEditorPlugin<
	'status',
	{
		actions: StatusPluginActions;
		commands: StatusPluginCommands;
		dependencies: StatusPluginDependencies;
		pluginConfiguration: StatusPluginOptions | undefined;
		sharedState: StatusState | undefined;
	}
>;
