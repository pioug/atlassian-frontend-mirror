import type { Color } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type {
	CollabEditPluginSharedState,
	CollabSendableSteps,
	PrivateCollabEditOptions,
} from './types';

export type CollabEditPlugin = NextEditorPlugin<
	'collabEdit',
	{
		pluginConfiguration: PrivateCollabEditOptions;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		sharedState: CollabEditPluginSharedState;
		actions: {
			getAvatarColor: (str: string) => { index: number; color: Color };
			addInlineCommentMark: (props: { from: number; to: number; mark: Mark }) => boolean;
			addInlineCommentNodeMark: (props: { pos: number; mark: Mark }) => boolean;
			isRemoteReplaceDocumentTransaction: (tr: Transaction) => boolean;
			getCurrentCollabState: () => {
				version: number | undefined;
				sendableSteps: CollabSendableSteps | undefined | null;
				content: JSONNode | undefined;
			};
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validatePMJSONDocument: (doc: any) => boolean;
		};
	}
>;
