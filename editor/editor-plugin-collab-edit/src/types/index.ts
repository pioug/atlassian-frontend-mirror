import type {
	CollabEditOptions,
	CollabEditProvider,
	CollabEventConflictPayload,
	CollabParticipant,
	SyncUpErrorFunction,
} from '@atlaskit/editor-common/collab';
import { type Step } from '@atlaskit/editor-prosemirror/dist/types/transform';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type PrivateCollabEditOptions = CollabEditOptions & {
	sanitizePrivateContent?: boolean;
	onSyncUpError?: SyncUpErrorFunction;
	hideTelecursorOnLoad?: boolean;
};

export type ProviderCallback = <ReturnType>(
	codeToExecute: (provider: CollabEditProvider) => ReturnType | undefined,
	onError?: (err: Error) => void,
) => Promise<ReturnType | undefined> | undefined;

export type ProviderBuilder = (
	collabEditProviderPromise: Promise<CollabEditProvider>,
) => ProviderCallback;

export interface ReadOnlyParticipants {
	get: (sessionId: string) => CollabParticipant | undefined;
	toArray: () => ReadonlyArray<CollabParticipant>;
	eq: (other: ReadOnlyParticipants) => boolean;
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

export type CollabSendableSteps = {
	version: number;
	steps: readonly Step[];
	clientID: number | string;
	origins: readonly Transaction[];
};

export type CollabEditPluginSharedState = {
	initialised: CollabInitializedMetadata & LastOrganicChangeMetadata;
	activeParticipants: ReadOnlyParticipants | undefined;
	sessionId: string | undefined;
	lastReconnectionConflictMetadata: CollabEventConflictPayload | undefined;
};
