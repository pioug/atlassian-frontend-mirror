import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type {
	CollabEditPluginSharedState,
	CollabSendableSteps,
	PrivateCollabEditOptions,
} from './types';

export type CollabEditPluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<ConnectivityPlugin>,
];

export type CollabEditPluginOptions = PrivateCollabEditOptions;

export type CollabEditPlugin = NextEditorPlugin<
	'collabEdit',
	{
		actions: {
			addInlineCommentMark: (props: { from: number; mark: Mark; to: number }) => boolean;
			addInlineCommentNodeMark: (props: { mark: Mark; pos: number }) => boolean;
			getAvatarColor: (
				str: string,
				agentType?: string,
			) => {
				backgroundColor: string;
				index: number;
				textColor: string;
			};
			getCurrentCollabState: () => {
				content: JSONNode | undefined;
				sendableSteps: CollabSendableSteps | undefined | null;
				version: number | undefined;
			};
			isRemoteReplaceDocumentTransaction: (tr: Transaction) => boolean;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validatePMJSONDocument: (doc: any) => boolean;
		};
		commands: {
			nudgeTelepointer: (sessionId: string) => EditorCommand;
		};
		dependencies: CollabEditPluginDependencies;
		pluginConfiguration: CollabEditPluginOptions;
		sharedState: CollabEditPluginSharedState;
	}
>;
