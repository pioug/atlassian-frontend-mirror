/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { default as datePlugin } from './datePlugin';
export type { DatePlugin } from './datePluginType';
export type {
	DatePluginSharedState,
	DatePluginConfig,
	DatePluginOptions,
	DateType,
	InsertDate,
} from './types';
