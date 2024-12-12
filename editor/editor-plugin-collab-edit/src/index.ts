/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { collabEditPlugin } from './collabEditPlugin';
export type { CollabEditPlugin } from './collabEditPluginType';
export type {
	CollabInitializedMetadata,
	CollabEditPluginSharedState,
	ReadOnlyParticipants,
	PrivateCollabEditOptions,
	CollabInviteToEditProps,
	CollabSendableSteps,
} from './types';
