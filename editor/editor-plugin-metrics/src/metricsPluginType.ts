import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
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
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		sharedState: MetricsState;
		commands: {
			setContentMoved: () => EditorCommand;
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
