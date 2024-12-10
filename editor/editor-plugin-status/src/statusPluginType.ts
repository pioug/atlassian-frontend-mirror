import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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
// TODO: Fix the type definition of editor-core's createUniversalPreset
type DummyAnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		actions: {
			setInlineCommentDraftState: (isDraft: boolean, inputMethod: INPUT_METHOD) => Command;
		};
		sharedState: {
			annotations: Record<string, boolean>;
			isVisible: boolean;
			bookmark: boolean;
			mouseData: {
				isSelecting: boolean;
			};
		};
	}
>;

// This dummy type is to bypass the typescript compiler maximum length limit error
// TODO: Fix the type definition of editor-core's createUniversalPreset
type DummyEditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: {
			mode: 'view' | 'edit';
		};
	}
>;

export type StatusPlugin = NextEditorPlugin<
	'status',
	{
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<DummyAnnotationPlugin>,
			OptionalPlugin<DummyEditorViewModePlugin>,
		];
		pluginConfiguration: StatusPluginOptions | undefined;
		actions: {
			commitStatusPicker: typeof commitStatusPicker;
			updateStatus: UpdateStatus;
		};
		commands: {
			removeStatus: typeof removeStatus;
			insertStatus: ReturnType<typeof insertStatus>;
		};
		sharedState: StatusState | undefined;
	}
>;
