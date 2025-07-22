/* eslint-disable @atlaskit/editor/only-export-plugin */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

// eslint-disable-next-line @atlaskit/editor/only-export-plugin
export {
	/**
	 * @private
	 * @deprecated Use {@link tablePlugin} instead.
	 */
	default as tablesPlugin,
	default as tablePlugin,
} from './tablePlugin';
// eslint-disable-next-line @atlaskit/editor/only-export-plugin
export type {
	TablePlugin,
	TablePluginOptions,
	TablePluginDependencies,
	TablePluginActions,
	TablePluginCommands,
} from './tablePluginType';
