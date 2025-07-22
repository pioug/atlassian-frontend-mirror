/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { collabEditPlugin } from './collabEditPlugin';
export type {
	CollabEditPlugin,
	CollabEditPluginOptions,
	CollabEditPluginDependencies,
} from './collabEditPluginType';
export type {
	CollabInitializedMetadata,
	CollabEditPluginSharedState,
	ReadOnlyParticipants,
	PrivateCollabEditOptions,
	CollabSendableSteps,
} from './types';
