/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { mentionsPlugin } from './mentionsPlugin';
export type {
	MentionsPlugin,
	MentionPluginDependencies,
	MentionActions,
} from './mentionsPluginType';
export type {
	MentionPluginConfig,
	MentionPluginOptions,
	MentionsPluginOptions,
	MentionSharedState,
	MentionsChangedHandler,
} from './types';
export type { InsertMentionParameters } from './editor-commands';
