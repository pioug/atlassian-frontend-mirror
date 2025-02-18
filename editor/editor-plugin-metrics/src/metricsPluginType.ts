import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { MetricsState } from './pm-plugins/main';

type handleIntentToStartEditProps = {
	newSelection?: Selection;
	shouldStartTimer?: boolean;
	shouldPersistActiveSession?: boolean;
};

export type MetricsPlugin = NextEditorPlugin<
	'metrics',
	{
		dependencies: [AnalyticsPlugin, OptionalPlugin<BlockControlsPlugin>];
		sharedState: MetricsState;
		commands: {
			startActiveSessionTimer: () => EditorCommand;
			stopActiveSession: () => EditorCommand;
			handleIntentToStartEdit: ({
				newSelection,
				shouldStartTimer,
				shouldPersistActiveSession,
			}: handleIntentToStartEditProps) => EditorCommand;
		};
	}
>;
