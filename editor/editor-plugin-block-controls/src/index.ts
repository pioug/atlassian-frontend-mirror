// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { blockControlsPlugin } from './blockControlsPlugin';
export type {
	BlockControlsPlugin,
	BlockControlsSharedState,
	HandleOptions,
	MoveNodeMethod,
	BlockControlsPluginDependencies,
	PluginState,
	MoveNode,
} from './blockControlsPluginType';
