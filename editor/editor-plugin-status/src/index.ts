/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { statusPlugin } from './statusPlugin';
export type {
	StatusPlugin,
	StatusPluginDependencies,
	StatusPluginActions,
	StatusPluginCommands,
} from './statusPluginType';
export type { StatusState, StatusType, StatusPluginOptions, ClosingPayload } from './types';
export type { UpdateStatus } from './pm-plugins/actions';
