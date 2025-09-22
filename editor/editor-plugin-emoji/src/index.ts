/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export type {
	EmojiPlugin,
	EmojiPluginOptions,
	EmojiPluginState,
	EmojiPluginSharedState,
	EmojiPluginDependencies,
	EmojiPluginActions,
	EmojiPluginCommands,
} from './emojiPluginType';
export { emojiPlugin } from './emojiPlugin';

// It would be nice to be able to export the provider that needs for the plugin from
// ./providers/..., but it's forbidden by https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4106313244/EES+Proposal+003+Editor+Plugins+Standards.
// So provider will be in ./pm-plugins/providers and we re-export it here with eslint ignore =(
// eslint-disable-next-line @atlaskit/editor/only-export-plugin
export { EmojiNodeDataProvider } from './pm-plugins/providers/EmojiNodeDataProvider';
