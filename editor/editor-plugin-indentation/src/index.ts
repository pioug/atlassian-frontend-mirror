/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { indentationPlugin } from './indentationPlugin';
export type {
	IndentationPlugin,
	IndentationPluginDependencies,
	IndentationPluginActions,
} from './indentationPluginType';
export type { IndentationInputMethod } from './editor-commands/utils';
