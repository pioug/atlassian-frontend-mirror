// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { blockControlsPlugin } from './blockControlsPlugin';
export type {
	BlockControlsPlugin,
	BlockControlsPluginConfig,
	BlockControlsSharedState,
	HandleOptions,
	MoveNodeMethod,
	BlockControlsPluginDependencies,
	NodeDecorationFactory,
	NodeDecorationFactoryParams,
	PluginState,
	RightEdgeButtonProps,
	MoveNode,
} from './blockControlsPluginType';
