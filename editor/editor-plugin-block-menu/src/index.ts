/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { blockMenuPlugin } from './blockMenuPlugin';
export type {
	BlockMenuPlugin,
	RegisterBlockMenuComponent,
	Parent,
	BlockMenuPluginOptions,
	BlockMenuSharedState,
} from './blockMenuPluginType';
export type {
	TransformNodeMetadata,
	TransfromNodeTargetType,
} from './editor-commands/transforms/types';
