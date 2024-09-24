import type {
	CollabEditOptions,
	CollabEditProvider,
	CollabParticipant,
	Color,
	SyncUpErrorFunction,
} from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { type Step } from '@atlaskit/editor-prosemirror/dist/types/transform';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type {
	InviteToEditComponentProps,
	InviteToEditButtonProps,
	CollabInviteToEditProps,
	CollabAnalyticsProps,
} from '@atlaskit/editor-common/collab';

export type PrivateCollabEditOptions = CollabEditOptions & {
	sanitizePrivateContent?: boolean;
	onSyncUpError?: SyncUpErrorFunction;
};

export type ProviderCallback = <ReturnType>(
	codeToExecute: (provider: CollabEditProvider) => ReturnType | undefined,
	onError?: (err: Error) => void,
) => Promise<ReturnType | undefined> | undefined;

export type ProviderBuilder = (
	collabEditProviderPromise: Promise<CollabEditProvider>,
) => ProviderCallback;

export interface ReadOnlyParticipants {
	get(sessionId: string): CollabParticipant | undefined;
	toArray(): ReadonlyArray<CollabParticipant>;
	eq(other: ReadOnlyParticipants): boolean;
}

export type CollabInitializedMetadata = {
	collabInitialisedAt: null | number;
	firstChangeAfterInitAt: null | number;
	firstContentBodyChangeAfterInitAt: null | number;
};

export type LastOrganicChangeMetadata = {
	lastLocalOrganicChangeAt: null | number;
	lastRemoteOrganicChangeAt: null | number;
	lastLocalOrganicBodyChangeAt: null | number;
	lastRemoteOrganicBodyChangeAt: null | number;
};

export type TrackSpammingStepsMetadata = {
	recentTransactionsTimestemps: Map<string, { timestamp: number; steps: Step[] }>;
};

export type CollabEditPluginSharedState = {
	initialised: CollabInitializedMetadata & LastOrganicChangeMetadata;
	activeParticipants: ReadOnlyParticipants | undefined;
	sessionId: string | undefined;
};

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
		};
	}
>;
