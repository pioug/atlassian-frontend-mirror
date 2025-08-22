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
	hideTelecursorOnLoad?: boolean;
	onSyncUpError?: SyncUpErrorFunction;
	sanitizePrivateContent?: boolean;
};

export type ProviderCallback = <ReturnType>(
	codeToExecute: (provider: CollabEditProvider) => ReturnType | undefined,
	onError?: (err: Error) => void,
) => Promise<ReturnType | undefined> | undefined;

export type ProviderBuilder = (
	collabEditProviderPromise: Promise<CollabEditProvider>,
) => ProviderCallback;

export interface ReadOnlyParticipants {
	eq: (other: ReadOnlyParticipants) => boolean;
	get: (sessionId: string) => CollabParticipant | undefined;
	toArray: () => ReadonlyArray<CollabParticipant>;
}

export type CollabInitializedMetadata = {
	collabInitialisedAt: null | number;
	firstChangeAfterInitAt: null | number;
	firstContentBodyChangeAfterInitAt: null | number;
};

export type LastOrganicChangeMetadata = {
	lastLocalOrganicBodyChangeAt: null | number;
	lastLocalOrganicChangeAt: null | number;
	lastRemoteOrganicBodyChangeAt: null | number;
	lastRemoteOrganicChangeAt: null | number;
};

export type TrackSpammingStepsMetadata = {
	recentTransactionsTimestemps: Map<string, { steps: Step[]; timestamp: number; }>;
};

export type CollabSendableSteps = {
	clientID: number | string;
	origins: readonly Transaction[];
	steps: readonly Step[];
	version: number;
};

export type CollabEditPluginSharedState = {
	activeParticipants: ReadOnlyParticipants | undefined;
	initialised: CollabInitializedMetadata & LastOrganicChangeMetadata;
	lastReconnectionConflictMetadata: CollabEventConflictPayload | undefined;
	sessionId: string | undefined;
};
